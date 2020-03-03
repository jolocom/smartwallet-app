import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import { CredentialsReceive } from 'jolocom-lib/js/interactionTokens/credentialsReceive'
import { CredentialOffering } from './types'
import { Interaction } from './interaction'
import { CredentialOfferResponse } from 'jolocom-lib/js/interactionTokens/credentialOfferResponse'
import { Flow } from './flow'

export class CredentialOfferFlow extends Flow {
  public credentialOfferingState: CredentialOffering[] = []

  public constructor(ctx: Interaction) {
    super(ctx)
  }

  public getState() {
    return this.credentialOfferingState
  }

  // TODO Go back to JSONWebToken<JWTEncodable> and use guard functions when casting
  public async handleInteractionToken(
    token: JSONWebToken<JWTEncodable>,
  ): Promise<any> {
    // TODO Push once all is good FIX
    this.tokens.push(token)
    switch (token.interactionType) {
      case InteractionType.CredentialOfferRequest:
        return this.handleOfferRequest(token as JSONWebToken<CredentialOfferRequest>)
      case InteractionType.CredentialOfferResponse:
        return this.handleOfferResponse(token as JSONWebToken<CredentialOfferResponse>)
      case InteractionType.CredentialsReceive:
        return this.handleCredentialReceive(token as JSONWebToken<CredentialsReceive>)
      default:
        throw new Error('Interaction type not found')
    }
  }

  private handleOfferRequest(token: JSONWebToken<CredentialOfferRequest>) {
    this.credentialOfferingState = token.interactionToken.offeredCredentials.map(offer => ({ ...offer, valid: true }))
  }

  private async handleOfferResponse(
    token: JSONWebToken<CredentialOfferResponse>,
  ) {
  // TODO Lift this to the base class? Perhaps it can later be composed with a function to prepare the response
    const credentialsReceive = await this.ctx.send<CredentialsReceive>(token)
    return this.handleInteractionToken(credentialsReceive)
  }

  private handleCredentialReceive(token: JSONWebToken<CredentialsReceive>) {
    this.credentialOfferingState = token.interactionToken.signedCredentials.map(credential => {
      const type = credential.type[credential.type.length - 1]
      const offering = this.credentialOfferingState.find(offering => offering.type === type)
      if (!offering) {
        throw new Error('Received wrong credentials')
      }
      return {
        ...offering,
        credential,
      }
    })
  }
}
