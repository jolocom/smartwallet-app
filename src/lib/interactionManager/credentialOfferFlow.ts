import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { CredentialOfferResponse } from 'jolocom-lib/js/interactionTokens/credentialOfferResponse'
import { CredentialsReceive } from 'jolocom-lib/js/interactionTokens/credentialsReceive'
import { JWTEncodable } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import { last } from 'ramda'
import { Flow } from './flow'
import { Interaction } from './interaction'
import { CredentialOfferFlowState } from './types'
import {
  isCredentialOfferRequest,
  isCredentialOfferResponse,
  isCredentialReceive,
} from './guards'

export class CredentialOfferFlow extends Flow {
  public state: CredentialOfferFlowState = {
    offerSummary: [],
  }

  public constructor(ctx: Interaction) {
    super(ctx)
  }

  public async handleInteractionToken(
    token: JWTEncodable,
    messageType: InteractionType,
  ): Promise<any> {
    switch (messageType) {
      case InteractionType.CredentialOfferRequest:
        if (isCredentialOfferRequest(token))
          return this.handleOfferRequest(token)
      case InteractionType.CredentialOfferResponse:
        if (isCredentialOfferResponse(token))
          return this.handleOfferResponse(token)
      case InteractionType.CredentialsReceive:
        if (isCredentialReceive(token))
          return this.handleCredentialReceive(token)
      default:
        throw new Error('Interaction type not found')
    }
  }

  private handleOfferRequest({ offeredCredentials }: CredentialOfferRequest) {
    this.state.offerSummary = offeredCredentials.map(offer => ({
      ...offer,
      validationErrors: {},
    }))
  }

  // Not relevant for client (?)
  private async handleOfferResponse(token: CredentialOfferResponse) {
    return
  }

  // Sets the validity map, currently if the issuer and if the subjects are correct.
  // also populates the SignedCredentialWithMetadata with credentials
  private async handleCredentialReceive({
    signedCredentials,
  }: CredentialsReceive) {
    this.state.offerSummary = await Promise.all(
      signedCredentials.map(async signedCredential => {
        const offer = this.state.offerSummary.find(
          ({ type }) => type === last(signedCredential.type),
        )

        if (!offer) {
          throw new Error('Received wrong credentials')
        }

        return {
          ...offer,
          signedCredential,
          validationErrors: {
            // This signals funny things in the flow without throwing errors. We
            // don't simply throw because often times negotiation is still
            // possible on the UI / UX layer, and the interaction can continue.
            invalidIssuer:
              signedCredential.issuer !== this.ctx.participants.them.did,
            invalidSubject:
              signedCredential.subject !== this.ctx.participants.us.did,
            invalidSignature: !(await this.ctx.validateDigestable(
              signedCredential,
            )),
          },
        }
      }),
    )
  }
}
