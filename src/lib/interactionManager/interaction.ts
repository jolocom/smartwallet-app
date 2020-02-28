import { CredentialOfferFlow } from './credentialOfferFlow'
import { IdentitySummary } from '../../actions/sso/types'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { BackendMiddleware } from '../../backendMiddleware'
import { InteractionChannel, InteractionFlows } from './types'
import { CredentialRequestFlow } from './credentialRequestFlow'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { httpAgent } from '../http'
import { JolocomLib } from 'jolocom-lib'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { CredentialMetadataSummary } from '../storage/storage'
import { keyIdToDid } from 'jolocom-lib/js/utils/helper';
import { generateIdentitySummary } from 'src/actions/sso/utils';

/***
 * - initiated by InteractionManager when an interaction starts
 * - handles the communication channel of the interaction
 * - holds the instance of the particular interaction (e.g. CredentialOffer, Authentication)
 */
export class Interaction {
  private interactionFlow = {
    [InteractionType.CredentialOfferRequest]: CredentialOfferFlow,
    [InteractionType.CredentialRequest]: CredentialRequestFlow,
  }

  public id: string
  public ctx: BackendMiddleware
  public flow!: InteractionFlows
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

  public async handleInteractionToken(token: JSONWebToken<JWTEncodable>) {
    // At some point we should strip the JSONWebToken<JWTEncodable>
    if (!this.issuerSummary) {
      // TODO Potential bug if we start with our token, i.e. we are the issuer
      const issuerDid = keyIdToDid(token.issuer)
      const issuerIdentity = await this.backendMiddleware.registry.resolve(
        issuerDid,
      )

      this.issuerSummary = await generateIdentitySummary(issuerIdentity)
    }

    if (!this.flow) {
      this.flow = new this.interactionFlow[token.interactionType](
        this.ctx,
        this.issuerSummary,
      )
    }

    // TODO before passing to the flow, we should validate the signature
    return this.flow.handleInteractionToken(token)
  }

  public getState() {
    return this.flow.getState()
  }

  public getFlow<T extends InteractionFlows>(): T {
    return this.flow as T
  }

  public async createInteractionToken(
    interactionType: InteractionType,
    data: any,
    request: JSONWebToken<CredentialOfferRequest>,
  ) {
    let tkn
    const createToken = this.ctx.identityWallet.create.interactionTokens

    switch (interactionType) {
      case InteractionType.CredentialOfferResponse:
        tkn = createToken.response.offer
        break
      default:
        throw new Error('Wrong interaction type')
    }

    const password = await this.ctx.keyChainLib.getPassword()
    return tkn(data, password, request)
  }

  public async validateJWT(jwt: JSONWebToken<JWTEncodable>) {
    await this.ctx.identityWallet.validateJWT(jwt)
  }

  public async sendPost<T extends JWTEncodable>(url: string, data: any) {
    const res = await httpAgent.postRequest<{ token: string }>(
      url,
      { 'Content-Type': 'application/json' },
      data,
    )
    return JolocomLib.parse.interactionToken.fromJWT<T>(res.token)
  }

  public async getStoredCredentialById(id: string) {
    return this.ctx.storageLib.get.verifiableCredential({
      id,
    })
  }

  public async storeCredential(credential: SignedCredential) {
    await this.ctx.storageLib.store.verifiableCredential(credential)
  }

  public async storeCredentialMetadata(metadata: CredentialMetadataSummary) {
    await this.ctx.storageLib.store.credentialMetadata(metadata)
  }

  public async storeIssuerProfile(profile: IdentitySummary) {
    await this.ctx.storageLib.store.issuerProfile(profile)
  }
}
