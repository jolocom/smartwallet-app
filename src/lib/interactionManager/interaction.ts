import { CredentialOfferFlow } from './credentialOfferFlow'
import { IdentitySummary } from '../../actions/sso/types'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { BackendMiddleware } from '../../backendMiddleware'
import { InteractionChannel, CredentialOffering } from './types'
import { CredentialRequestFlow } from './credentialRequestFlow'
import { httpAgent } from '../http'
import { JolocomLib } from 'jolocom-lib'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { CredentialMetadataSummary } from '../storage/storage'
import { keyIdToDid } from 'jolocom-lib/js/utils/helper';
import { generateIdentitySummary } from 'src/actions/sso/utils';
import { Flow } from './flow'
import { last } from 'ramda'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'

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
  }

  public id: string
  public ctx: BackendMiddleware
  public flow!: Flow
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
    return this.flow.getMessages()
  }

  public async createCredentialOfferResponseToken(
    selectedOffering: CredentialOffering[],
  ) {
    const credentialOfferRequest = this.getMessages()
      .find(({interactionType}) => interactionType === InteractionType.CredentialOfferRequest) as JSONWebToken<CredentialOfferRequest>

    const credentialOfferResponseAttr = {
      callbackURL: credentialOfferRequest.interactionToken.callbackURL,
      selectedCredentials: selectedOffering.map(offer => ({
        type: offer.type,
      })),
    }

    // TODO lol, it's about capturing "this"
    return this.createInteractionToken().response.offer(
      credentialOfferResponseAttr,
      await this.ctx.keyChainLib.getPassword(),
      credentialOfferRequest,
    )
  }

  public async handleInteractionToken(token: JSONWebToken<JWTEncodable>) {
    // At some point we should strip the JSONWebToken<JWTEncodable>
    if (!this.issuerSummary) {
      // TODO Potential bug if we start with our token, i.e. we are the issuer
      this.issuerSummary = generateIdentitySummary(await this.ctx.registry.resolve(keyIdToDid(token.issuer)))
    }

    if (!this.flow) {
      this.flow = new this.interactionFlow[token.interactionType](this)
    }


    // TODO Pass the previous token instead of undefined
    await this.ctx.identityWallet.validateJWT(
      token,
      last(this.getMessages()),
      this.ctx.registry
    )

    // TODO before passing to the flow, we should validate the signature
    return this.flow.handleInteractionToken(token)
  }

  public createInteractionToken = () => this.ctx.identityWallet.create.interactionTokens

  public getState() {
    return this.flow.getState()
  }

  public getAttributesByType = (type: string[]) =>  {
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
  public async sendPost<T extends JWTEncodable>(url: string, data: any) {
    const res = await httpAgent.postRequest<{ token: string }>(
      url,
      { 'Content-Type': 'application/json' },
      data,
    )
    return JolocomLib.parse.interactionToken.fromJWT<T>(res.token)
  }

  public async storeCredential(credential: SignedCredential) {
    await this.ctx.storageLib.store.verifiableCredential(credential)
  }

  public storeCredentialMetadata = async (metadata: CredentialMetadataSummary) => {
    await this.ctx.storageLib.store.credentialMetadata(metadata)
  }

  public async storeIssuerProfile() {
    await this.ctx.storageLib.store.issuerProfile(this.issuerSummary)
  }
}
