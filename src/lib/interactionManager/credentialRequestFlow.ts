import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types';
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest';
import { CredentialRequestSummary } from '../../actions/sso/types';
import { getUiCredentialTypeByType } from '../util';
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential';
import { Interaction } from './interaction';
import { isEmpty } from 'ramda'

// TODO Backendmiddleware was just replaced with CTX :: Interaction to follow the example from the credentialOfferFlow
// This is really broken

export class CredentialRequestFlow {
  public tokens: Array<JSONWebToken<JWTEncodable>> = []
  private ctx: Interaction
  private credRequestState!: CredentialRequestSummary

  constructor(
    ctx: Interaction,
  ) {
    this.ctx = ctx
  }

  public getState() {
    return this.credRequestState
  }

  public async handleInteractionToken(token: JSONWebToken<JWTEncodable>) {
    switch (token.interactionType) {
    case InteractionType.CredentialRequest: // TODO Rename this to consumeRequest in the Offer class
      await this.consumeRequest(token as JSONWebToken<CredentialRequest>)
      break
    case InteractionType.CredentialsReceive:
    default:
      throw new Error('Interaction type not found')
    }
  }

  public async consumeRequest(request: JSONWebToken<CredentialRequest>) {
    const {
      requestedCredentialTypes: requestedTypes,
    } = request.interactionToken

    const attributesForType = await Promise.all<AttributeSummary>(
      requestedTypes.map(this.ctx.getAttributesByType),
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

        return Promise.all(results.map(async ({values, verification}) => ({
          type: getUiCredentialTypeByType(type),
          values,
          verifications: await this.ctx.getVerifiableCredential({ id: verification, }),
        })))
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
          selfSigned: vCred.signer.did === this.ctx.ctx.identityWallet.did,
          expires: vCred.expires,
        })),
      })),
    )

    const flattened = abbreviated.reduce((acc, val) => acc.concat(val))

    // TODO requester shouldn't be optional
    this.credRequestState = {
      callbackURL: request.interactionToken.callbackURL,
      requester: this.ctx.issuerSummary,
      availableCredentials: flattened,
      requestJWT: request.encode(),
    }

    this.tokens.push(request)
  }
}

interface AttributeSummary {
  type: string[]
  results: Array<{
    verification: string
    fieldName: string
    values: string[]
  }>
}
