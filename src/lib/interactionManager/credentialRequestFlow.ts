import { JWTEncodable } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest'
import { getUiCredentialTypeByType } from '../util'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { Interaction } from './interaction'
import { isEmpty } from 'ramda'
import { Flow } from './flow'
import { CredentialResponse } from 'jolocom-lib/js/interactionTokens/credentialResponse'
import { AttributeSummary, CredentialRequestFlowState } from './types'
import { isCredentialRequest, isCredentialResponse } from './guards'

export class CredentialRequestFlow extends Flow<CredentialRequestFlowState> {
  private credRequestState!: CredentialRequestFlowState

  constructor(ctx: Interaction) {
    super(ctx)
  }

  public getState() {
    return this.credRequestState
  }

  /*
   * Implementation of the abstract handler defined in {@link Flow}
   * Given an interaction token, will fire the appropriate step in the protocol or throw
   */

  public async handleInteractionToken(
    token: JWTEncodable,
    interactionType: InteractionType,
  ) {
    switch (interactionType) {
      case InteractionType.CredentialRequest:
        if (isCredentialRequest(token))
          return this.handleCredentialRequest(token)
      case InteractionType.CredentialResponse:
        if (isCredentialResponse(token))
          return this.handleCredentialResponse(token)
      default:
        throw new Error('Interaction type not found')
    }
  }

  private async handleCredentialRequest(request: CredentialRequest) {
    const { requestedCredentialTypes } = request

    const attributesForType = await Promise.all<AttributeSummary>(
      requestedCredentialTypes.map(this.ctx.getAttributesByType),
    )

    const populatedWithCredentials = await Promise.all(
      attributesForType.map(({ results, type }) => {
        if (isEmpty(results)) {
          return [
            {
              type: getUiCredentialTypeByType(type),
              values: [],
              verifications: [],
            },
          ]
        }

        return Promise.all(
          results.map(async ({ values, verification }) => ({
            type: getUiCredentialTypeByType(type),
            values,
            verifications: await this.ctx.getVerifiableCredential({
              id: verification,
            }),
          })),
        )
      }),
    )

    const abbreviated = populatedWithCredentials.map(attribute =>
      attribute.map(entry => ({
        ...entry,
        verifications: entry.verifications.map((vCred: SignedCredential) => ({
          id: vCred.id,
          issuer: {
            did: vCred.issuer,
          },
          selfSigned: vCred.signer.did === this.ctx.participants.us.did,
          expires: vCred.expires,
        })),
      })),
    )

    this.credRequestState = abbreviated.reduce((acc, val) => acc.concat(val))
  }

  // Currently no validation here
  public handleCredentialResponse(token: CredentialResponse) {}
}
