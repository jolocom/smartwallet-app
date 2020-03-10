import { CredentialOfferFlow } from './credentialOfferFlow'
import {
  IdentitySummary,
  CredentialVerificationSummary,
} from '../../actions/sso/types'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { BackendMiddleware } from '../../backendMiddleware'
import {
  InteractionChannel,
  InteractionSummary,
  SignedCredentialWithMetadata,
} from './types'
import { CredentialRequestFlow } from './credentialRequestFlow'
import { JolocomLib } from 'jolocom-lib'
import { CredentialMetadataSummary } from '../storage/storage'
import { generateIdentitySummary } from 'src/actions/sso/utils'
import { Flow } from './flow'
import { last } from 'ramda'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { AuthenticationFlow } from './authenticationFlow'
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest'
import { CredentialsReceive } from 'jolocom-lib/js/interactionTokens/credentialsReceive'
import { Linking } from 'react-native'
import { AppError, ErrorCode } from '../errors'

/***
 * - initiated by InteractionManager when an interaction starts
 * - handles the communication channel of the interaction
 * - holds the instance of the particular interaction (e.g. CredentialOffer, Authentication)
 *
 * TODO needs to hold:
 *  callbackURL
 *  participants { us them }
 */

export class Interaction {
  private interactionFlow = {
    [InteractionType.CredentialOfferRequest]: CredentialOfferFlow,
    [InteractionType.CredentialRequest]: CredentialRequestFlow,
    [InteractionType.Authentication]: AuthenticationFlow,
  }
  private interactionMessages: JSONWebToken<JWTEncodable>[] = []

  public id: string
  public ctx: BackendMiddleware
  public flow!: Flow

  // This is the channel through which the request (first token) came in.
  public channel: InteractionChannel
  public issuerSummary!: IdentitySummary

  public constructor(
    ctx: BackendMiddleware,
    channel: InteractionChannel,
    id: string,
  ) {
    this.ctx = ctx
    this.channel = channel
    this.id = id
  }

  public getMessages() {
    return this.interactionMessages
  }

  // TODO Try to write a respond function that collapses these
  public async createAuthenticationResponse() {
    // TODO Abstract to getMessages * findByType
    return this.ctx.identityWallet.create.interactionTokens.response.auth(
      this.getSummary().state,
      await this.ctx.keyChainLib.getPassword(),
      this.getMessages().find(
        ({ interactionType }) =>
          interactionType === InteractionType.Authentication,
      ),
    )
  }

  public async createCredentialResponse(
    selectedCredentials: CredentialVerificationSummary[],
  ) {
    // TODO Abstract to getMessages * findByType
    const request = this.getMessages().find(
      ({ interactionType }) =>
        interactionType === InteractionType.CredentialRequest,
    ) as JSONWebToken<CredentialRequest>

    const credentials = await Promise.all(
      selectedCredentials.map(
        async ({ id }) => (await this.getVerifiableCredential({ id }))[0],
      ),
    )

    return this.ctx.identityWallet.create.interactionTokens.response.share(
      {
        callbackURL: request.interactionToken.callbackURL,
        suppliedCredentials: credentials.map(c => c.toJSON()),
      },
      await this.ctx.keyChainLib.getPassword(),
      request,
    )
  }

  public async createCredentialOfferResponseToken(
    selectedOffering: SignedCredentialWithMetadata[],
  ) {
    const credentialOfferRequest = this.getMessages().find(
      ({ interactionType }) =>
        interactionType === InteractionType.CredentialOfferRequest,
    ) as JSONWebToken<CredentialOfferRequest>

    const credentialOfferResponseAttr = {
      callbackURL: credentialOfferRequest.interactionToken.callbackURL,
      selectedCredentials: selectedOffering.map(offer => ({
        type: offer.type,
      })),
    }

    return this.ctx.identityWallet.create.interactionTokens.response.offer(
      credentialOfferResponseAttr,
      await this.ctx.keyChainLib.getPassword(),
      credentialOfferRequest,
    )
  }

  // rename to signal this does validation
  public async processInteractionToken(token: JSONWebToken<JWTEncodable>) {
    // At some point we should strip the JSONWebToken<JWTEncodable>
    if (!this.issuerSummary) {
      // TODO Potential bug if we start with our token, i.e. we are the issuer
      this.issuerSummary = generateIdentitySummary(
        await this.ctx.registry.resolve(token.signer.did),
      )
    }

    if (!this.flow) {
      this.flow = new this.interactionFlow[token.interactionType](this)
    }

    if (token.signer.did !== this.ctx.identityWallet.did) {
      await this.ctx.identityWallet.validateJWT(
        token,
        last(this.getMessages()),
        this.ctx.registry,
      )
    }

    await this.ctx.identityWallet.validateJWT(
      token,
      undefined, // TODO Extract from .getMessages()
      this.ctx.registry,
    )

    if (token.interactionType === InteractionType.CredentialsReceive) {
      await JolocomLib.util.validateDigestables(
        (token as JSONWebToken<CredentialsReceive>).interactionToken
          .signedCredentials,
      )
    }

    // TODO Should be pushed only in case of success
    this.interactionMessages.push(token)
    return this.flow.handleInteractionToken(
      token.interactionToken,
      token.interactionType,
    )
  }

  public getSummary(): InteractionSummary {
    return {
      issuer: this.issuerSummary,
      state: this.flow.getState(),
    }
  }

  public getAttributesByType = (type: string[]) => {
    return this.ctx.storageLib.get.attributesByType(type)
  }

  public async getStoredCredentialById(id: string) {
    return this.ctx.storageLib.get.verifiableCredential({
      id,
    })
  }

  public getVerifiableCredential = (query?: object) => {
    return this.ctx.storageLib.get.verifiableCredential(query)
  }

  // @dev This will crash with a credential receive because it doesn't contain
  // a callbackURL
  // TODO This should probably come from the transport / channel handler
  public async send<T extends JWTEncodable>(
    token: JSONWebToken<JWTEncodable>,
  ): Promise<JSONWebToken<T> | undefined> {
    //@ts-ignore - needs fix on the lib for JWTEncodable.
    const { callbackURL } = token.interactionToken

    switch (this.channel) {
      case InteractionChannel.HTTP:
        const response = await fetch(callbackURL, {
          method: 'POST',
          body: JSON.stringify({ token: token.encode() }),
          headers: { 'Content-Type': 'application/json' },
        })

        try {
          return JolocomLib.parse.interactionToken.fromJWT<T>(
            (await response.json()).token,
          )
        } catch {
          return
        }
      case InteractionChannel.Deeplink:
        const callback = `${callbackURL}/${token.encode()}`
        if (!(await Linking.canOpenURL(callback))) {
          throw new AppError(ErrorCode.DeepLinkUrlNotFound)
        }
        return Linking.openURL(callback)
      default:
        throw new AppError(ErrorCode.TransportNotSupported)
    }
  }

  public async storeCredential(toSave: SignedCredentialWithMetadata[]) {
    return Promise.all(
      toSave.map(
        ({ signedCredential }) =>
          signedCredential &&
          this.ctx.storageLib.store.verifiableCredential(signedCredential),
      ),
    )
  }

  public storeCredentialMetadata = (metadata: CredentialMetadataSummary) =>
    this.ctx.storageLib.store.credentialMetadata(metadata)

  public storeIssuerProfile = () =>
    this.ctx.storageLib.store.issuerProfile(this.issuerSummary)
}
