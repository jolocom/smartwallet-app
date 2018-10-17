import { Dispatch, AnyAction } from 'redux'
import { JolocomLib } from 'jolocom-lib'
import { StateCredentialRequestSummary, StateVerificationSummary } from 'src/reducers/sso'
import { BackendMiddleware } from 'src/backendMiddleware'
import { navigationActions } from 'src/actions'
import { routeList } from 'src/routeList'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { showErrorScreen } from 'src/actions/generic'
import { CredentialsReceivePayload } from 'jolocom-lib/js/interactionFlows/credentialsReceive/credentialsReceivePayload'
import { getUiCredentialTypeByType } from 'src/lib/util'
import { InteractionType } from 'jolocom-lib/js/interactionFlows/types'
import { resetSelected } from '../account'
import { CredentialRequestPayload } from 'jolocom-lib/js/interactionFlows/credentialRequest/credentialRequestPayload'

export const setCredentialRequest = (request: StateCredentialRequestSummary) => {
  return {
    type: 'SET_CREDENTIAL_REQUEST',
    value: request
  }
}

export const clearCredentialRequest = () => {
  return {
    type: 'CLEAR_CREDENTIAL_REQUEST'
  }
}

export const setReceivingCredential = (external: SignedCredential[]) => {
  return {
    type: 'SET_EXTERNAL',
    external
  }
}

export const resetReceivingCredential = () => {
  return {
    type: 'RESET_EXTERNAL'
  }
}

export const parseJWT = (encodedJwt: string) => {
  return async (dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware: BackendMiddleware) => {
    const returnedDecodedJwt = await JolocomLib.parse.interactionJSONWebToken.decode(encodedJwt)
    if (returnedDecodedJwt instanceof CredentialRequestPayload) {
      dispatch(consumeCredentialRequest(returnedDecodedJwt))
    }
    if (returnedDecodedJwt instanceof CredentialsReceivePayload) {
      dispatch(receiveExternalCredential(returnedDecodedJwt))
    }
  }
}

export const receiveExternalCredential = (credReceive: CredentialsReceivePayload) => {
  return async (dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware: BackendMiddleware) => {
    const providedCredentials = credReceive.getSignedCredentials()
    const registry = JolocomLib.registry.jolocom.create()

    const results = await Promise.all(providedCredentials.map(vcred => registry.validateSignature(vcred)))

    if (results.every(el => el === true)) {
      dispatch(setReceivingCredential(providedCredentials))
      dispatch(navigationActions.navigate({ routeName: routeList.CredentialDialog }))
    } else {
      dispatch(showErrorScreen(new Error('Signature validation failed')))
    }
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

export const consumeCredentialRequest = (decodedCredentialRequest: CredentialRequestPayload) => {
  return async (dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware: BackendMiddleware) => {
    const { storageLib } = backendMiddleware
    const { did } = getState().account.did.toJS()

    const requestedTypes = decodedCredentialRequest.getRequestedCredentialTypes()
    const attributesForType = await Promise.all<AttributeSummary>(requestedTypes.map(storageLib.get.attributesByType))

    const populatedWithCredentials = await Promise.all(
      attributesForType.map(async entry => {
        if (entry.results.length) {
          return Promise.all(
            entry.results.map(async result => ({
              type: getUiCredentialTypeByType(entry.type),
              values: result.values,
              verifications: await storageLib.get.verifiableCredential({ id: result.verification })
            }))
          )
        }

        return [{
          type: getUiCredentialTypeByType(entry.type),
          values: [],
          verifications: []
        }]
      })
    )

    const abbreviated = populatedWithCredentials.map(attribute =>
      attribute.map(entry => ({
        ...entry,
        verifications: entry.verifications.map((vCred: SignedCredential) => ({
          id: vCred.getId(),
          issuer: vCred.getIssuer(),
          selfSigned: vCred.getSigner().did === did,
          expires: vCred.getExpiryDate()
        }))
      }))
    )

    const flattened = abbreviated.reduce((acc, val) => acc.concat(val))

    // TODO requester shouldn't be optional
    const summary = {
      callbackURL: decodedCredentialRequest.getCallbackURL(),
      requester: decodedCredentialRequest.iss,
      availableCredentials: flattened
    }

    dispatch(setCredentialRequest(summary))
    dispatch(navigationActions.navigate({ routeName: routeList.Consent }))
  }
}

// TODO Decrypt when fetching from storage
export const sendCredentialResponse = (selectedCredentials: StateVerificationSummary[]) => {
  return async (dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware: BackendMiddleware) => {
    const { storageLib, keyChainLib, encryptionLib, ethereumLib } = backendMiddleware

    const encryptionPass = await keyChainLib.getPassword()
    const { did } = getState().account.did.toJS()
    const { callbackURL } = getState().sso.activeCredentialRequest

    const personaData = await storageLib.get.persona({ did })

    const { encryptedWif } = personaData[0].controllingKey
    const decryptedWif = encryptionLib.decryptWithPass({
      cipher: encryptedWif,
      pass: encryptionPass
    })

    const { privateKey } = ethereumLib.wifToEthereumKey(decryptedWif)

    const registry = JolocomLib.registry.jolocom.create()
    const wallet = await registry.authenticate(Buffer.from(privateKey, 'hex'))

    const credentials = await Promise.all(
      selectedCredentials.map(async cred => (await storageLib.get.verifiableCredential({ id: cred.id }))[0])
    )

    const jsonCredentials = credentials.map(cred => cred.toJSON())
    const credentialResponse = await wallet.create.credentialResponseJSONWebToken({
      typ: InteractionType.CredentialResponse,
      credentialResponse: {
        suppliedCredentials: jsonCredentials
      }
    })

    try {
      await fetch(callbackURL, {
        method: 'POST',
        body: JSON.stringify({ token: credentialResponse.encode() }),
        headers: { 'Content-Type': 'application/json' }
      })

      dispatch(clearCredentialRequest())
      dispatch(navigationActions.navigatorReset({ routeName: routeList.Home }))
    } catch (err) {
      // TODO better handling
      dispatch(showErrorScreen(err))
    }
  }
}

export const cancelSSO = () => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(clearCredentialRequest())
    dispatch(navigationActions.navigatorReset({ routeName: routeList.Home }))
  }
}

export const cancelReceiving = () => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch(resetSelected())
    dispatch(navigationActions.navigatorReset({ routeName: routeList.Home }))
  }
}
