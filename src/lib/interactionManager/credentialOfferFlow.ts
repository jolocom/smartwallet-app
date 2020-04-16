import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { CredentialOfferResponse } from 'jolocom-lib/js/interactionTokens/credentialOfferResponse'
import { CredentialsReceive } from 'jolocom-lib/js/interactionTokens/credentialsReceive'
import { JWTEncodable } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import { last } from 'ramda'
import { Flow } from './flow'
import { Interaction } from './interaction'
import { CredentialOfferFlowState, IssuanceResult } from './types'
import {
  isCredentialOfferRequest,
  isCredentialOfferResponse,
  isCredentialReceive,
} from './guards'

export class CredentialOfferFlow extends Flow {
  public state: CredentialOfferFlowState = {
    offerSummary: [],
    selection: [],
    issued: [],
  }

  public constructor(ctx: Interaction) {
    super(ctx)
  }

  public async handleInteractionToken(
    token: JWTEncodable,
    messageType: InteractionType,
  ): Promise<boolean> {
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

  private handleOfferRequest(offer: CredentialOfferRequest) {
    this.state.offerSummary = offer.offeredCredentials
    return true
  }

  private async handleOfferResponse(token: CredentialOfferResponse) {
    this.state.selection = token.selectedCredentials
    return true
  }

  // Sets the validity map, currently if the issuer and if the subjects are correct.
  // also populates the SignedCredentialWithMetadata with credentials
  private handleCredentialReceive({ signedCredentials }: CredentialsReceive) {
    this.state.issued = signedCredentials
    return true
  }

  public getIssuanceResult(): IssuanceResult {
    return this.state.issued.map(cred => {
      const offer = this.state.offerSummary.find(
        ({ type }) => type === last(cred.type),
      )

      if (!offer) {
        throw new Error('Received wrong credentials')
      }

      return {
        ...offer,
        signedCredential: cred,
        validationErrors: {
          invalidIssuer: cred.issuer !== this.ctx.participants.requester.did,
          invalidSubject: cred.subject !== this.ctx.participants.responder!.did,
        },
      }
    })
  }
}
