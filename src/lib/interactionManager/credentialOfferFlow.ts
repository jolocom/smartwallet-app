import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
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

  public async handleInteractionToken(token: JSONWebToken<JWTEncodable>) : Promise<any> {
    // TODO Push once all is good FIX
    this.tokens.push(token)
    switch (token.interactionType) {
      case InteractionType.CredentialOfferRequest:
        return this.consumeOfferRequest(token)
      case InteractionType.CredentialOfferResponse:
        return this.sendCredentialResponse(token as JSONWebToken<CredentialOfferResponse>)
      case InteractionType.CredentialsReceive:
        return this.consumeCredentialReceive(token)
      default:
        throw new Error('Interaction type not found')
    }
  }

  private consumeOfferRequest(token: JSONWebToken<JWTEncodable>) {
    const credOfferRequest = token as JSONWebToken<CredentialOfferRequest>

    this.setOffering(_ =>
      credOfferRequest.interactionToken.offeredCredentials.map(offer => ({
        ...offer,
        valid: true,
      })),
    )
  }

  private consumeCredentialReceive(token: JSONWebToken<JWTEncodable>) {
    const credentialsReceive = token as JSONWebToken<CredentialsReceive>
    this.updateOfferingWithCredentials(
      credentialsReceive.interactionToken.signedCredentials,
    )
  }

  private updateOfferingWithCredentials = (credentials: SignedCredential[]) => {
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

  private setOffering(
    factory: (state: CredentialOffering[]) => CredentialOffering[],
  ) {
    this.credentialOfferingState = factory(this.credentialOfferingState)
    return this.credentialOfferingState
  }

  private async sendCredentialResponse(token: JSONWebToken<CredentialOfferResponse>) {
    // TODO Replace with send function provided by interaction class
    const credentialsReceive = await this.ctx.sendPost<CredentialsReceive>(
      token.interactionToken.callbackURL,
      { token: token.encode() },
    )

    return this.handleInteractionToken(credentialsReceive)
  }

}
