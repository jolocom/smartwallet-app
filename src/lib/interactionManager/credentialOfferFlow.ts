import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { CredentialOffer } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { areRequirementsEmpty } from '../../actions/sso/utils'
import { IdentitySummary } from '../../actions/sso/types'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'

export enum InteractionChannel {
  QR = 'QR',
  Deeplink = 'Deeplink',
}

export interface CredentialOffering extends CredentialOffer {
  credential?: SignedCredential
  valid: boolean
}

export class CredentialOfferFlow {
  private credentialOfferRequest:
    | JSONWebToken<CredentialOfferRequest>
    | undefined
  private interactionChannel: InteractionChannel | undefined
  private credentialOffering: CredentialOffering[] | undefined
  private issuerSummary: IdentitySummary | undefined

  public setOfferRequest(token: JSONWebToken<CredentialOfferRequest>) {
    if (!areRequirementsEmpty(token.interactionToken)) {
      throw new Error('Input requests are not yet supported on the wallet')
    }
    this.credentialOfferRequest = token
  }

  public start(channel: InteractionChannel) {
    this.interactionChannel = channel
  }

  public getChannel = () => {
    if (!this.interactionChannel) {
      throw new Error('Could not find interaction channel')
    }
    return this.interactionChannel
  }

  public end() {
    this.credentialOffering = undefined
    this.issuerSummary = undefined
    this.credentialOfferRequest = undefined
    this.interactionChannel = undefined
  }

  public getCredentialOffering = () => {
    if (!this.credentialOffering) {
      throw new Error('No credential offering')
    }
    return this.credentialOffering
  }

  public setCredentialOffering = (offering: CredentialOffering[]) => {
    this.credentialOffering = offering
  }

  public updateOfferingWithCredentials = (credentials: SignedCredential[]) => {
    this.credentialOffering = credentials.map(credential => {
      const type = credential.type[credential.type.length - 1]
      const offering = this.getCredentialOffering().find(
        offering => offering.type === type,
      )
      if (!offering) {
        throw new Error('Received wrong credentials')
      }
      return {
        ...offering,
        credential,
      }
    })
  }

  public setOfferDetails = (
    offerToken: JSONWebToken<CredentialOfferRequest>,
    issuerSummary: IdentitySummary,
    credentialOffering: CredentialOffering[],
  ) => {
    this.setOfferRequest(offerToken)
    this.credentialOffering = credentialOffering
    this.issuerSummary = issuerSummary
  }

  public getOfferDetails = () => {
    if (
      !this.credentialOfferRequest ||
      !this.credentialOffering ||
      !this.issuerSummary
    ) {
      throw new Error('Offer details not found')
    }
    return {
      credentialOffering: this.credentialOffering,
      credentialOfferRequest: this.credentialOfferRequest,
      issuerSummary: this.issuerSummary,
    }
  }
}

/***
 * - initiated inside BackendMiddleware
 * - has access to identityWallet / registry ?? (or should be inside Interaction)
 * - holds a map of all interactions:
 *    - {nonce: token or interaction instance} ??
 * - can start / end an interaction
 *
 */

class Manager {
  public readonly interactions = {}

  public start(channel: InteractionChannel, token: JSONWebToken<JWTEncodable>) {
    const interaction = new Interaction(channel, token)
    this.interactions[token.nonce] = interaction
    return interaction
  }
}

/***
 * - initiated by InteractionManager when an interaction starts
 * - handles the communication channel of the interaction
 * - holds the instance of the particular interaction (e.g. CredentialOffer, Authentication)
 */

type InteractionFlows = CredentialOfferFlow | CredentialRequestFlow

class Interaction {
  private interactionFlow = {
    [InteractionType.CredentialOfferRequest]: CredentialOfferFlow,
    [InteractionType.CredentialRequest]: CredentialRequestFlow,
  }
  public flow: InteractionFlows
  public channel: InteractionChannel | undefined

  public constructor(
    channel: InteractionChannel,
    interactionToken: JSONWebToken<JWTEncodable>,
  ) {
    this.flow = new this.interactionFlow[interactionToken.interactionType](
      interactionToken,
    )
    this.channel = channel
  }
}

class CredentialRequestFlow {}
