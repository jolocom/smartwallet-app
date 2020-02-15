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
  public credentialOfferingState!: CredentialOffering[]
  public callbackURL: string
  public tokens: Array<JSONWebToken<JWTEncodable>> = []

  public constructor(
    credentialOfferRequest: JSONWebToken<CredentialOfferRequest>,
  ) {
    this.callbackURL = credentialOfferRequest.interactionToken.callbackURL
    this.handleInteractionToken(credentialOfferRequest)
  }

  public getToken(type: InteractionType) {
    const token = this.tokens.find(token => token.interactionType === type)
    if (!token) throw new Error('Token not found')

    return token
  }

  public handleInteractionToken(token: JSONWebToken<JWTEncodable>) {
    this.tokens.push(token)
    switch (token.interactionType) {
      case InteractionType.CredentialOfferRequest:
        this.consumeOfferRequest(token)
        break
      case InteractionType.CredentialOfferResponse:
        this.consumeOfferResponse(token)
        break
      case InteractionType.CredentialsReceive:
        this.consumeCredentialReceive(token)
        break
      default:
        break
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

  public consumeOfferResponse(token: JSONWebToken<JWTEncodable>) {
    //this.credentialOfferRequest = token as JSONWebToken<CredentialOfferRequest>
  }

  public consumeCredentialReceive(token: JSONWebToken<JWTEncodable>) {
    const credentialsReceive = token as JSONWebToken<CredentialsReceive>
    this.updateOfferingWithCredentials(
      credentialsReceive.interactionToken.signedCredentials,
    )
  }

  // maybe shouldn't be here
  public updateOfferingWithCredentials = (credentials: SignedCredential[]) => {
    if (!this.credentialOfferingState.length) {
      throw new Error('No credential offering found')
    }

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
    const credentialOfferRequest = this.getToken(
      InteractionType.CredentialOfferRequest,
    ) as JSONWebToken<CredentialOfferRequest>
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

