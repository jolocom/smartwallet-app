import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest'
import {
  CredentialRequestSummary,
  CredentialTypeSummary,
  CredentialVerificationSummary,
  IdentitySummary,
} from './types'
import { ThunkAction } from '../../store'
import { JolocomLib } from 'jolocom-lib'
import { Linking } from 'react-native'
import { AppError } from '../../lib/errors'
import ErrorCode from '../../lib/errorCodes'
import { assembleRequestSummary, cancelSSO } from './index'
import { getUiCredentialTypeByType } from '../../lib/util'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'

/**
 * Given an credential request JWT will return a {@link CredentialRequestSummary}
 * to be used by the {@link ShareConsentContainer}.
 * @param credentialRequest - the interaction token received from the counterparty
 * @param requester - a summary of the requester's identity
 * @returns a parsed credential request summary
 */

export const credentialRequestSummary = (
  credentialRequest: JSONWebToken<CredentialRequest>,
  requester: IdentitySummary,
): CredentialRequestSummary => ({
  callbackURL: credentialRequest.interactionToken.callbackURL,
  ...assembleRequestSummary(credentialRequest, requester),
})

/**
 * Given a list of selected credentials
 * @param selectedCredentials
 * @param credentialRequestDetails
 * @param isDeepLinkInteraction
 */

export const prepareAndSendCredentialResponse = (
  selectedCredentials: CredentialVerificationSummary[],
  credentialRequestDetails: CredentialRequestSummary,
  isDeepLinkInteraction: boolean = false,
): ThunkAction => async (dispatch, getState, backendMiddleware) => {
  const { storageLib, keyChainLib, identityWallet } = backendMiddleware
  const { callbackURL, requestJWT } = credentialRequestDetails

  const password = await keyChainLib.getPassword()
  const request = JolocomLib.parse.interactionToken.fromJWT(requestJWT)

  const credentials = await Promise.all(
    selectedCredentials.map(
      async cred =>
        (await storageLib.get.verifiableCredential({ id: cred.id }))[0],
    ),
  )

  const jsonCredentials = credentials.map(cred => cred.toJSON())

  const response = await identityWallet.create.interactionTokens.response.share(
    {
      callbackURL,
      suppliedCredentials: jsonCredentials,
    },
    password,
    request,
  )

  if (isDeepLinkInteraction) {
    const callback = `${callbackURL}${response.encode()}`
    if (!(await Linking.canOpenURL(callback))) {
      throw new AppError(ErrorCode.DeepLinkUrlNotFound)
    }

    return Linking.openURL(callback).then(() => dispatch(cancelSSO))
  }
  await fetch(callbackURL, {
    method: 'POST',
    body: JSON.stringify({ token: response.encode() }),
    headers: { 'Content-Type': 'application/json' },
  })
  dispatch(cancelSSO)
}

interface AttributeSummary {
  type: string[]
  results: Array<{
    verification: string
    fieldName: string
    values: string[]
  }>
}

/**
 * Given an array of credential types, returns them from the database.
 * In a specifically formatted way
 * @param requestedTypes
 * @returns - Array of type credential type summaries
 */

export const fetchMatchingCredentials = (
  requestedTypes: string[][],
): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
): Promise<CredentialTypeSummary[]> => {
  const { storageLib } = backendMiddleware
  const { did } = getState().account.did
  const attributesForType = await Promise.all<AttributeSummary>(
    requestedTypes.map(storageLib.get.attributesByType),
  )

  const populatedWithCredentials = await Promise.all(
    attributesForType.map(async entry => {
      if (entry.results.length) {
        return Promise.all(
          entry.results.map(async result => ({
            type: getUiCredentialTypeByType(entry.type),
            values: result.values,
            verifications: await storageLib.get.verifiableCredential({
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

  return abbreviated.reduce((acc, val) => acc.concat(val))
}
