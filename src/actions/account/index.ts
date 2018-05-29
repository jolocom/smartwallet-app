import { AnyAction, Dispatch } from 'redux'
import { navigationActions, genericActions } from 'src/actions/'
import { BackendMiddleware } from 'src/backendMiddleware'
import { routeList } from 'src/routeList'
import { prepareClaimsForUI } from 'src/actions/account/helper'
import { IVerifiableCredentialAttrs } from 'jolocom-lib/js/credentials/verifiableCredential/types'

export const setDid = (did: string) => {
  return {
    type: 'DID_SET',
    value: did
  }
}

// TODO Abstract parsing of error messages
export const checkIdentityExists = () => {
  return async (dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware : BackendMiddleware) => {
    const { storageLib } = backendMiddleware

    try {
      const personas = await storageLib.get.persona()
      if (!personas.length) {
        return
      }

      dispatch(setDid(personas[0].did))
      dispatch(navigationActions.navigate({ routeName: routeList.Identity }))
    } catch(err) {
      if (err.message.indexOf('no such table') === 0) {
        return
      }

      dispatch(genericActions.showErrorScreen(err))
    }
  }
}

export const openClaimDetails = (id: string) => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch({
      type: 'SET_SELECTED',
      selected: {id}
    })
    dispatch(navigationActions.navigate({
      routeName: routeList.ClaimDetails
    }))
  }
}

export const saveClaim = (claimVal: string, claimField: string) => {
  return async (dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware : BackendMiddleware) => {
    console.log('saveClaim action: ', claimVal, claimField)
    dispatch(navigationActions.navigate({
      routeName: routeList.Identity
    }))
  }
}

export const toggleLoading = (val: boolean) => {
  return {
    type: 'SET_LOADING',
    loading: val
  }
}

export const getClaimsForDid = () => {
  return async (dispatch: Dispatch<AnyAction>, getState: Function) => {
    const state = getState().account.claims.toJS()
    dispatch(toggleLoading(!state.loading))

    const claims = prepareClaimsForUI(dummyC)
    dispatch({
        type: 'GET_CLAIMS_DID',
        claims
    })
  }
}

const dummyC : IVerifiableCredentialAttrs[]  = [
  {
    "@context": [
      "https://w3id.org/identity/v1","https://w3id.org/security/v1",
      "https://w3id.org/credentials/v1","http://schema.org"
    ],
    id: "claimId:a7e0aa7f5b1fe84c9552645c1fd50928ff8ae9f09580",
    issuer:"did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb",
    type: ["Credential", "EmailCredential"],
    claim: {
      id: "did:jolo:test",
      email:"test@gmx.de"
    },
    issued: "2018-05-29T11:05:40.282Z",
    proof: {
      type:"EcdsaKoblitzSignature2016",
      created:"2018-05-29T11:05:40.283Z",
      creator:"did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb#keys-1",
      nonce: "b8cc7f31fd875290",
      signatureValue: "sA3hBXBy3tVjbTBngwZREgMlAlSlEYk3LuzGDqLEdqtdL3BjSgWWR7/Q+ZmTa6DjLNMgfE+Ib+eREM8v+43sqw=="
    }
  },
  {
    "@context": [
      "https://w3id.org/identity/v1","https://w3id.org/security/v1",
      "https://w3id.org/credentials/v1","http://schema.org"
    ],
    id: "claimId:a7e0aa7f5b1fe84c9552645c1fd50928ff8ae9f09585",
    issuer:"did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb",
    type: ["Credential", "TelephoneCredential"],
    claim: {
      id: "did:jolo:test",
      telephone:"011-111"
    },
    issued: "2018-05-29T11:05:40.282Z",
    proof: {
      type:"EcdsaKoblitzSignature2016",
      created:"2018-05-29T11:05:40.283Z",
      creator:"did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb#keys-1",
      nonce: "b8cc7f31fd875290",
      signatureValue: "sA3hBXBy3tVjbTBngwZREgMlAlSlEYk3LuzGDqLEdqtdL3BjSgWWR7/Q+ZmTa6DjLNMgfE+Ib+eREM8v+43sqw=="
    }
  },
  {
    "@context": [
      "https://w3id.org/identity/v1","https://w3id.org/security/v1",
      "https://w3id.org/credentials/v1","http://schema.org"
    ],
    id: "claimId:a7e0aa7f5b1fe84c9552645c1fd50928ff8ae9f09587",
    issuer:"did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb",
    type: ["Credential", "NameCredential"],
    claim: {
      id: "did:jolo:test",
      name: "Bobby Fischer"
    },
    issued: "2018-05-29T11:05:40.282Z",
    proof: {
      type:"EcdsaKoblitzSignature2016",
      created:"2018-05-29T11:05:40.283Z",
      creator:"did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb#keys-1",
      nonce: "b8cc7f31fd875290",
      signatureValue: "sA3hBXBy3tVjbTBngwZREgMlAlSlEYk3LuzGDqLEdqtdL3BjSgWWR7/Q+ZmTa6DjLNMgfE+Ib+eREM8v+43sqw=="
    }
  }
]