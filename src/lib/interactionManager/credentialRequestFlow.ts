import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types';
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest';
import { IdentitySummary, CredentialRequestSummary } from '../../actions/sso/types';
import { BackendMiddleware } from 'src/backendMiddleware';
import { getUiCredentialTypeByType } from '../util';
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential';

export class CredentialRequestFlow {
  public tokens: Array<JSONWebToken<JWTEncodable>> = []
  private requesterSummary: IdentitySummary
  private backendMiddleware: BackendMiddleware
  private credRequestState!: CredentialRequestSummary

  constructor(
    backendMiddleware: BackendMiddleware,
    issuerSummary: IdentitySummary
  ) {
    this.requesterSummary = issuerSummary
    this.backendMiddleware = backendMiddleware
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
    await this.backendMiddleware.identityWallet.validateJWT(
      request,
      undefined,
      this.backendMiddleware.registry,
    )

    this.credRequestState = await wodoo(this.backendMiddleware.identityWallet.did, request, this.requesterSummary, this.backendMiddleware)
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

const wodoo = async (did: string, request: JSONWebToken<CredentialRequest>,requester: IdentitySummary, backendMiddleware: BackendMiddleware) => {
  const {
    requestedCredentialTypes: requestedTypes,
  } = request.interactionToken
  const { storageLib }  = backendMiddleware

  const attributesForType = await Promise.all<AttributeSummary>(
    requestedTypes.map(storageLib.get.attributesByType),
  )

  const populatedWithCredentials = await Promise.all(
    attributesForType.map(async entry => {
      if (entry.results.length) {
        return Promise.all(
          entry.results.map(async result => ({
            type: getUiCredentialTypeByType(entry.type),
            values: result.values, verifications: await storageLib.get.verifiableCredential({
              id: result.verification,
            }),
          })),
        )
      }

      return [
        {
          type: getUiCredentialTypeByType(entry.type),
          values: [],
          verifications: [],
        },
      ]
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
        selfSigned: vCred.signer.did === did,
        expires: vCred.expires,
      })),
    })),
  )

  const flattened = abbreviated.reduce((acc, val) => acc.concat(val))

  // TODO requester shouldn't be optional
  const credentialRequestDetails = {
    callbackURL: request.interactionToken.callbackURL,
    requester: requester,
    availableCredentials: flattened,
    requestJWT: request.encode(),
  }

  console.log(credentialRequestDetails)
  return credentialRequestDetails
}
