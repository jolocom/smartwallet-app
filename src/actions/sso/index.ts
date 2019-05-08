import { Dispatch, AnyAction } from 'redux'
import { Linking } from 'react-native'
import { JolocomLib } from 'jolocom-lib'
import {
  StateCredentialRequestSummary,
  StateVerificationSummary,
} from 'src/reducers/sso'
import { BackendMiddleware } from 'src/backendMiddleware'
import { navigationActions, accountActions } from 'src/actions'
import { routeList } from 'src/routeList'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { showErrorScreen } from 'src/actions/generic'
import { getUiCredentialTypeByType } from 'src/lib/util'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import { resetSelected } from '../account'
import { CredentialOffer } from 'jolocom-lib/js/interactionTokens/credentialOffer'
import { PaymentRequest } from 'jolocom-lib/js/interactionTokens/paymentRequest'
import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialsReceive } from 'jolocom-lib/js/interactionTokens/credentialsReceive'
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest'
import { getIssuerPublicKey } from 'jolocom-lib/js/utils/helper'
import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
import { KeyTypes } from 'jolocom-lib/js/vaultedKeyProvider/types'
import { consumePaymentRequest } from './paymentRequest'
import { Authentication } from 'jolocom-lib/js/interactionTokens/authentication'
import { consumeAuthenticationRequest } from './authenticationRequest'

export const setCredentialRequest = (
  request: StateCredentialRequestSummary,
) => ({
  type: 'SET_CREDENTIAL_REQUEST',
  value: request,
})

export const clearInteractionRequest = () => ({
  type: 'CLEAR_INTERACTION_REQUEST',
})

export const setReceivingCredential = (external: SignedCredential[]) => ({
  type: 'SET_EXTERNAL',
  external,
})

export const setDeepLinkLoading = (value: boolean) => ({
  type: 'SET_DEEP_LINK_LOADING',
  value,
})

export const parseJWT = (encodedJwt: string) => async (
  dispatch: Dispatch<AnyAction>,
) => {
  dispatch(accountActions.toggleLoading(true))
  try {
    const returnedDecodedJwt = await JolocomLib.parse.interactionToken.fromJWT(
      encodedJwt,
    )

    switch (returnedDecodedJwt.interactionType) {
      case InteractionType.CredentialRequest:
        return dispatch(
          consumeCredentialRequest(returnedDecodedJwt as JSONWebToken<
            CredentialRequest
          >),
        )
      case InteractionType.CredentialOffer:
        return dispatch(
          consumeCredentialOfferRequest(returnedDecodedJwt as JSONWebToken<
            CredentialOffer
          >),
        )
      case InteractionType.CredentialsReceive:
        return dispatch(
          receiveExternalCredential(returnedDecodedJwt as JSONWebToken<
            CredentialsReceive
          >),
        )
      case InteractionType.PaymentRequest:
        return dispatch(
          consumePaymentRequest(returnedDecodedJwt as JSONWebToken<
            PaymentRequest
          >),
        )
      case InteractionType.Authentication:
        return dispatch(
          consumeAuthenticationRequest(returnedDecodedJwt as JSONWebToken<
            Authentication
          >),
        )
      default:
        return new Error('Unknown interaction type when parsing JWT')
    }
  } catch (err) {
    console.log('error: ', err)
    dispatch(accountActions.toggleLoading(false))
    dispatch(setDeepLinkLoading(false))
    dispatch(showErrorScreen(err))
  }
}

export const consumeCredentialOfferRequest = (
  credOfferRequest: JSONWebToken<CredentialOffer>,
) => async (
  dispatch: Dispatch<AnyAction>,
  getState: Function,
  backendMiddleware: BackendMiddleware,
) => {
  const { keyChainLib, identityWallet, registry } = backendMiddleware

  try {
    await identityWallet.validateJWT(credOfferRequest, undefined, registry)

    const password = await keyChainLib.getPassword()
    const credOfferResponse = await identityWallet.create.interactionTokens.response.offer(
      {
        callbackURL: credOfferRequest.interactionToken.callbackURL,
        instant: credOfferRequest.interactionToken.instant,
        requestedInput: {},
      },
      password,
      credOfferRequest,
    )

    const res = await fetch(credOfferRequest.interactionToken.callbackURL, {
      method: 'POST',
      body: JSON.stringify({ token: credOfferResponse.encode() }),
      headers: { 'Content-Type': 'application/json' },
    }).then(body => body.json())

    dispatch(parseJWT(res.token))
  } catch (err) {
    dispatch(accountActions.toggleLoading(false))
    dispatch(setDeepLinkLoading(false))
    dispatch(showErrorScreen(new Error('JWT Token parse failed')))
  }
}

export const receiveExternalCredential = (
  credReceive: JSONWebToken<CredentialsReceive>,
) => async (
  dispatch: Dispatch<AnyAction>,
  getState: Function,
  backendMiddleware: BackendMiddleware,
) => {
  const { identityWallet, registry } = backendMiddleware

  try {
    await identityWallet.validateJWT(credReceive, undefined, registry)
  } catch (error) {
    console.log(error)
    dispatch(
      showErrorScreen(
        new Error('Validation of external credential token failed'),
      ),
    )
  }

  try {
    const providedCredentials = credReceive.interactionToken.signedCredentials

    const results = await Promise.all(
      providedCredentials.map(async vcred => {
        const remoteIdentity = await registry.resolve(vcred.issuer)
        return SoftwareKeyProvider.verifyDigestable(
          getIssuerPublicKey(vcred.signer.keyId, remoteIdentity.didDocument),
          vcred,
        )
      }),
    )

    if (results.every(el => el === true)) {
      dispatch(setReceivingCredential(providedCredentials))
      dispatch(accountActions.toggleLoading(false))
      dispatch(
        navigationActions.navigatorReset({
          routeName: routeList.CredentialDialog,
        }),
      )
    } else {
      dispatch(accountActions.toggleLoading(false))
      dispatch(showErrorScreen(new Error('Signature validation failed')))
    }
  } catch (error) {
    dispatch(accountActions.toggleLoading(false))
    dispatch(
      showErrorScreen(
        new Error('Signature validation on external credential failed'),
      ),
    )
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

export const consumeCredentialRequest = (
  decodedCredentialRequest: JSONWebToken<CredentialRequest>,
) => async (
  dispatch: Dispatch<AnyAction>,
  getState: Function,
  backendMiddleware: BackendMiddleware,
) => {
  const { storageLib, identityWallet, registry } = backendMiddleware
  const { did } = getState().account.did.toJS()

  try {
    await identityWallet.validateJWT(
      decodedCredentialRequest,
      undefined,
      registry,
    )
    const requestedTypes =
      decodedCredentialRequest.interactionToken.requestedCredentialTypes
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
          issuer: vCred.issuer,
          selfSigned: vCred.signer.did === did,
          expires: vCred.expires,
        })),
      })),
    )
    const flattened = abbreviated.reduce((acc, val) => acc.concat(val))

    // TODO requester shouldn't be optional
    const summary = {
      callbackURL: decodedCredentialRequest.interactionToken.callbackURL,
      requester: decodedCredentialRequest.issuer,
      availableCredentials: flattened,
      requestJWT: decodedCredentialRequest.encode(),
    }

    dispatch(setCredentialRequest(summary))
    dispatch(accountActions.toggleLoading(false))
    dispatch(navigationActions.navigatorReset({ routeName: routeList.Consent }))
    dispatch(setDeepLinkLoading(false))
  } catch (error) {
    console.log(error)
    dispatch(accountActions.toggleLoading(false))
    dispatch(
      showErrorScreen(new Error('Consumption of credential request failed')),
    )
  }
}

export const sendCredentialResponse = (
  selectedCredentials: StateVerificationSummary[],
) => async (
  dispatch: Dispatch<AnyAction>,
  getState: Function,
  backendMiddleware: BackendMiddleware,
) => {
  const { storageLib, keyChainLib, encryptionLib, registry } = backendMiddleware
  const { activeCredentialRequest: {
    callbackURL, requestJWT
  }, isDeepLinkInteraction } = getState().sso

  try {
    const password = await keyChainLib.getPassword()
    const decryptedSeed = encryptionLib.decryptWithPass({
      cipher: await storageLib.get.encryptedSeed(),
      pass: password,
    })
    const userVault = new SoftwareKeyProvider(
      Buffer.from(decryptedSeed, 'hex'),
      password,
    )

    const wallet = await registry.authenticate(userVault, {
      derivationPath: KeyTypes.jolocomIdentityKey,
      encryptionPass: password,
    })

    const credentials = await Promise.all(
      selectedCredentials.map(
        async cred =>
          (await storageLib.get.verifiableCredential({ id: cred.id }))[0],
      ),
    )

    const jsonCredentials = credentials.map(cred => cred.toJSON())

    const request = JolocomLib.parse.interactionToken.fromJWT( requestJWT, )
    const response = await wallet.create.interactionTokens.response.share(
      {
        callbackURL,
        suppliedCredentials: jsonCredentials,
      },
      password,
      request,
    )

    if (isDeepLinkInteraction) {
      return Linking.openURL(`${callbackURL}/${response.encode()}`)
      .then(() => dispatch(cancelSSO()))
    } else {
      return fetch(callbackURL, {
        method: 'POST',
        body: JSON.stringify({ token: response.encode() }),
        headers: { 'Content-Type': 'application/json' },
      }).then(() => dispatch(cancelSSO()))
    }
  } catch (error) {
    // TODO: better error message
    dispatch(clearInteractionRequest())
    console.log(error)
    dispatch(accountActions.toggleLoading(false))
    dispatch(
      showErrorScreen(
        new Error('The credential response could not be created'),
      ),
    )
  }
}

export const cancelSSO = () => (dispatch: Dispatch<AnyAction>) => {
  dispatch(clearInteractionRequest())
  dispatch(accountActions.toggleLoading(false))
  dispatch(navigationActions.navigatorReset({ routeName: routeList.Home }))
}

export const cancelReceiving = () => (dispatch: Dispatch<AnyAction>) => {
  dispatch(resetSelected())
  dispatch(navigationActions.navigatorReset({ routeName: routeList.Home }))
}

export const toggleDeepLinkFlag = (value: boolean) => ({
  type: 'SET_DEEP_LINK_FLAG',
  value,
})
