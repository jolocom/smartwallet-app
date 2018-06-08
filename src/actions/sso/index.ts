import { Dispatch, AnyAction } from 'redux'
import { CredentialRequest } from 'jolocom-lib/js/credentialRequest/'
import { VerifiableCredential } from 'jolocom-lib/js/credentials/verifiableCredential'
import { StateCredentialRequestSummary, StateAttributeSummary, StateTypeSummary, StateVerificationSummary } from 'src/reducers/sso'
import { BackendMiddleware } from 'src/backendMiddleware'
import { navigationActions } from 'src/actions'
import { routeList } from 'src/routeList'
import { showErrorScreen } from 'src/actions/generic'

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

export const consumeCredentialRequest = (jwtEncodedCR: string) => {
  return async(dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware: BackendMiddleware) => {
    const { storageLib } = backendMiddleware
    const CR = new CredentialRequest().fromJWT(jwtEncodedCR)
    const requestedTypes = CR.getRequestedCredentialTypes()

    const credentialRequests = await Promise.all<StateTypeSummary>(requestedTypes.map(async type => {
      const values: string[] = await storageLib.get.attributesByType(type)

      const attributeSummaries = await Promise.all<StateAttributeSummary>(values.map(async value => {
        const verifications: VerifiableCredential[] = await storageLib.get.vCredentialsByAttributeValue(value)
        const json = verifications.map(v => v.toJSON())
        const validVerifications = CR.applyConstraints(json)
        const verificationSummaries = validVerifications.map(verification => ({
          id: verification.id,
          issuer: verification.issuer,
          expires: verification.expires
        }))

        return {
          value,
          verifications: verificationSummaries
        }
      }))

      return {
        type,
        credentials: attributeSummaries
      }
    }))

    const summary = {
      requester: CR.getRequester(),
      callbackURL: CR.getCallbackURL(),
      request: credentialRequests
    }

    dispatch(setCredentialRequest(summary))
    dispatch(navigationActions.navigate({routeName: routeList.Consent}))
  }
}

// TODO Decrypt when fetching from storage
export const sendCredentialResponse = (selectedCredentials: StateVerificationSummary[]) => {
  return async(dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware: BackendMiddleware) => {
    const { jolocomLib, storageLib, keyChainLib, encryptionLib, ethereumLib } = backendMiddleware

    const encryptionPass = await keyChainLib.getPassword()
    const currentDid = getState().account.did.get('did')
    const personaData = await storageLib.get.persona({did: currentDid})
    const { encryptedWif } = personaData[0].controllingKey

    const decryptedWif = encryptionLib.decryptWithPass({
      cipher: encryptedWif,
      pass: encryptionPass
    })

    const { privateKey } = ethereumLib.wifToEthereumKey(decryptedWif)

    const wallet = jolocomLib.wallet.fromPrivateKey(Buffer.from(privateKey, 'hex'))

    const credentials = await Promise.all(selectedCredentials.map(async cred => {
      const results = await storageLib.get.verifiableCredential({id: cred.id})
      return results[0]
    }))

    const jsonForm = credentials.map(cred => cred.toJSON())
    const credentialResponse = wallet.createCredentialResponse(jsonForm)

    const { callbackURL } = getState().sso.activeCredentialRequest

    // TODO Do we care about the response?
    try {
      await fetch(callbackURL, {
        method: 'POST',
        body: JSON.stringify({token: credentialResponse}),
        headers: {'content-type': 'application/json'}
      })

      dispatch(clearCredentialRequest())
      dispatch(navigationActions.navigatorReset({ routeName: routeList.Home }))
    } catch(err) {
      dispatch(showErrorScreen(err))
    }
  }
}
