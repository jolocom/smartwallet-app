import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import {
  CredentialOffer,
  CredentialOfferResponseSelection,
} from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import { backendMiddleware } from '../../store'
import { CredentialsReceive } from 'jolocom-lib/js/interactionTokens/credentialsReceive'

export enum InteractionChannel {
  QR = 'QR',
  Deeplink = 'Deeplink',
}

export interface CredentialOffering extends CredentialOffer {
  credential?: SignedCredential
  valid: boolean
}

export class CredentialOfferFlow {
  public credentialOfferingState: CredentialOffering[] = []
  public callbackURL: string
  public tokens: Array<JSONWebToken<JWTEncodable>> = []

  public constructor(
    credentialOfferRequest: JSONWebToken<CredentialOfferRequest>,
  ) {
    this.callbackURL = credentialOfferRequest.interactionToken.callbackURL
    this.handleInteractionToken(credentialOfferRequest)
  }

  public getToken<T extends JWTEncodable>(type: InteractionType) {
    const token = this.tokens.find(token => token.interactionType === type)
    if (!token) throw new Error('Token not found')

    // TODO fix type casting
    return token as JSONWebToken<T>
  }

  public handleInteractionToken(token: JSONWebToken<JWTEncodable>) {
    this.tokens.push(token)
    switch (token.interactionType) {
      case InteractionType.CredentialOfferRequest:
        this.consumeOfferRequest(token)
        break
      case InteractionType.CredentialsReceive:
        this.consumeCredentialReceive(token)
        break
      default:
        throw new Error('Interaction type not found')
    }
  }

  public consumeOfferRequest(token: JSONWebToken<JWTEncodable>) {
    const credOfferRequest = token as JSONWebToken<CredentialOfferRequest>
    this.setOffering(_ =>
      credOfferRequest.interactionToken.offeredCredentials.map(offer => ({
        ...offer,
        valid: true,
      })),
    )
  }

  public consumeCredentialReceive(token: JSONWebToken<JWTEncodable>) {
    const credentialsReceive = token as JSONWebToken<CredentialsReceive>
    this.updateOfferingWithCredentials(
      credentialsReceive.interactionToken.signedCredentials,
    )
  }

  public updateOfferingWithCredentials = (credentials: SignedCredential[]) => {
    this.setOffering(offeringState =>
      credentials.map(credential => {
        const type = credential.type[credential.type.length - 1]
        const offering = offeringState.find(offering => offering.type === type)
        if (!offering) {
          throw new Error('Received wrong credentials')
        }
        return {
          ...offering,
          credential,
        }
      }),
    )
  }

  //TODO get rid of setOffering(both) ???
  //manage the offering from outside the manager entirely
  public async setOfferingAsync(
    cb: (state: CredentialOffering[]) => Promise<CredentialOffering[]>,
  ) {
    this.credentialOfferingState = await cb(this.credentialOfferingState)
    return this.credentialOfferingState
  }

  public setOffering(
    cb: (state: CredentialOffering[]) => CredentialOffering[],
  ) {
    this.credentialOfferingState = cb(this.credentialOfferingState)
    return this.credentialOfferingState
  }

  public async createCredentialResponseToken(
    selectedOffering: CredentialOffering[],
  ) {
    const credentialOfferRequest = this.getToken<CredentialOfferRequest>(
      InteractionType.CredentialOfferRequest,
    )
    const { callbackURL } = credentialOfferRequest.interactionToken
    const password = await backendMiddleware.keyChainLib.getPassword()

    // NOTE not returning providedInput since it's not used
    const selectedTypes: CredentialOfferResponseSelection[] = selectedOffering.map(
      offer => ({ type: offer.type }),
    )
    const credOfferResponse = await backendMiddleware.identityWallet.create.interactionTokens.response.offer(
      { callbackURL, selectedCredentials: selectedTypes },
      password,
      this.getToken(InteractionType.CredentialOfferRequest),
    )
    this.handleInteractionToken(credOfferResponse)
    return credOfferResponse
  }
}
