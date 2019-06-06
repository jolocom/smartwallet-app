import { Linking } from 'react-native'
import { JolocomLib } from 'jolocom-lib'
import {
  StateCredentialRequestSummary,
  StateVerificationSummary,
} from 'src/reducers/sso'
import { navigationActions } from 'src/actions'
import { routeList } from 'src/routeList'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { getUiCredentialTypeByType } from 'src/lib/util'
import { convertToDecoratedClaim, resetSelected} from '../account'
import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialsReceive } from 'jolocom-lib/js/interactionTokens/credentialsReceive'
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest'
import { ThunkDispatch } from '../../store'
import { CredentialMetadataSummary } from '../../lib/storage/storage'
import { equals, mergeRight, omit } from 'ramda'
import { RootState } from '../../reducers'
import { BackendMiddleware } from '../../backendMiddleware'
import { AnyAction } from 'redux'
import { keyIdToDid } from 'jolocom-lib/js/utils/helper'
import { DecoratedClaims } from '../../reducers/account'
import { IdentitySummary } from './types'

export const setCredentialRequest = (
  request: StateCredentialRequestSummary,
) => ({
  type: 'SET_CREDENTIAL_REQUEST',
  value: request,
})

export const clearInteractionRequest = {
  type: 'CLEAR_INTERACTION_REQUEST',
}

export const setReceivingCredential = (
  requester: IdentitySummary,
  external: Array<{
    decoratedClaim: DecoratedClaims
    credential: SignedCredential
  }>,
) => ({
  type: 'SET_EXTERNAL',
  value: { offeror: requester, offer: external },
})

export const setDeepLinkLoading = (value: boolean): AnyAction => ({
  type: 'SET_DEEP_LINK_LOADING',
  value,
})

export const receiveExternalCredential = (
  credReceive: JSONWebToken<CredentialsReceive>,
  offeror: IdentitySummary,
  credentialOfferMetadata?: Array<CredentialMetadataSummary>,
) => async (
  dispatch: ThunkDispatch,
  getState: () => RootState,
  backendMiddleware: BackendMiddleware,
) => {
  const { identityWallet, registry, storageLib } = backendMiddleware

  await identityWallet.validateJWT(credReceive, undefined, registry)
  const providedCredentials = credReceive.interactionToken.signedCredentials

  const validationResults = await JolocomLib.util.validateDigestables(
    providedCredentials,
  )

  // TODO Error Code
  if (validationResults.some(equals(false))) {
    throw new Error('Invalid credentials received')
  }

  if (credentialOfferMetadata) {
    await Promise.all(
      credentialOfferMetadata.map(storageLib.store.credentialMetadata),
    )
  }

  if (offeror) {
    await storageLib.store.issuerProfile(offeror)
  }

  const asDecoratedCredentials = providedCredentials.map(
    convertToDecoratedClaim,
  )

  dispatch(
    setReceivingCredential(
      offeror,
      providedCredentials.map((cred, i) => ({
        credential: cred,
        decoratedClaim: asDecoratedCredentials[i],
      })),
    ),
  )

  return dispatch(
    navigationActions.navigatorReset({
      routeName: routeList.CredentialDialog,
    }),
  )
}

interface AttributeSummary {
  type: string[]
  results: Array<{
    verification: string
    fieldName: string
    values: string[]
  }>
}

export const consumeCredentialRequest = (
  decodedCredentialRequest: JSONWebToken<CredentialRequest>,
) => async (
  dispatch: ThunkDispatch,
  getState: () => RootState,
  backendMiddleware: BackendMiddleware,
) => {
  const { storageLib, identityWallet, registry } = backendMiddleware
  const { did } = getState().account.did

  await identityWallet.validateJWT(
    decodedCredentialRequest,
    undefined,
    registry,
  )

  const { did: issuerDid, publicProfile } = await registry.resolve(
    keyIdToDid(decodedCredentialRequest.issuer),
  )

  const parsedProfile = publicProfile
    ? omit(['id', 'did'], publicProfile.toJSON().claim)
    : {}

  const issuerInfo = mergeRight(
    { did: issuerDid },
    { publicProfile: parsedProfile },
  )


  const {
    requestedCredentialTypes: requestedTypes,
  } = decodedCredentialRequest.interactionToken

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

  const flattened = abbreviated.reduce((acc, val) => acc.concat(val))

  // TODO requester shouldn't be optional
  const summary = {
    callbackURL: decodedCredentialRequest.interactionToken.callbackURL,
    requester: issuerInfo,
    availableCredentials: flattened,
    requestJWT: decodedCredentialRequest.encode(),
  }

  dispatch(setCredentialRequest(summary))
  return dispatch(
    navigationActions.navigatorReset({ routeName: routeList.Consent }),
  )
}

export const sendCredentialResponse = (
  selectedCredentials: StateVerificationSummary[],
) => async (
  dispatch: ThunkDispatch,
  getState: () => RootState,
  backendMiddleware: BackendMiddleware,
) => {
  const { storageLib, keyChainLib, identityWallet } = backendMiddleware
  const {
    activeCredentialRequest: { callbackURL, requestJWT },
    isDeepLinkInteraction,
  } = getState().sso

  try {
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
      return Linking.openURL(`${callbackURL}${response.encode()}`).then(() =>
        dispatch(cancelSSO),
      )
    } else {
      return fetch(callbackURL, {
        method: 'POST',
        body: JSON.stringify({ token: response.encode() }),
        headers: { 'Content-Type': 'application/json' },
      })
    }
  } finally {
    dispatch(cancelSSO)
    dispatch(clearInteractionRequest)
  }
}

export const cancelSSO = (dispatch: ThunkDispatch) => {
  dispatch(clearInteractionRequest)
  return dispatch(
    navigationActions.navigatorReset({ routeName: routeList.Home }),
  )
}

export const cancelReceiving = (dispatch: ThunkDispatch) => {
  dispatch(resetSelected())
  return dispatch(
    navigationActions.navigatorReset({ routeName: routeList.Home }),
  )
}

export const toggleDeepLinkFlag = (value: boolean) => ({
  type: 'SET_DEEP_LINK_FLAG',
  value,
})
