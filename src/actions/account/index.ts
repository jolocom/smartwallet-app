import { AnyAction, Dispatch } from 'redux'
import { navigationActions, genericActions } from 'src/actions/'
import { BackendMiddleware } from 'src/backendMiddleware'
import { routeList } from 'src/routeList'
import { prepareClaimsForState } from 'src/actions/account/helper'
import { IVerifiableCredentialAttrs } from 'jolocom-lib/js/credentials/verifiableCredential/types'

export const setDid = (did: string) => {
  return {
    type: 'DID_SET',c
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

export const openClaimDetails = (id: string, claimField: string) => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch({
      type: 'SET_SELECTED',
      selected: {id, claimField}
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

    const claims = prepareClaimsForState(dummyClaims)
    dispatch({
        type: 'GET_CLAIMS_DID',
        claims: ''
    })
  }
}

// const dummyC : IVerifiableCredentialAttrs[]  = [
//   {
//     "@context": [
//       "https://w3id.org/identity/v1","https://w3id.org/security/v1",
//       "https://w3id.org/credentials/v1","http://schema.org"
//     ],
//     id: "claimId:a7e0aa7f5b1fe84c9552645c1fd50928ff8ae9f09580",
//     issuer:"did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb",
//     type: ["Credential"],
//     claim: {
//       id: "did:jolo:test",
//       email:"test@gmx.de"
//     },
//     issued: "2018-05-29T11:05:40.282Z",
//     proof: {
//       type:"EcdsaKoblitzSignature2016",
//       created:"2018-05-29T11:05:40.283Z",
//       creator:"did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb#keys-1",
//       nonce: "b8cc7f31fd875290",
//       signatureValue: "sA3hBXBy3tVjbTBngwZREgMlAlSlEYk3LuzGDqLEdqtdL3BjSgWWR7/Q+ZmTa6DjLNMgfE+Ib+eREM8v+43sqw=="
//     }
//   },
//   {
//     "@context": [
//       "https://w3id.org/identity/v1","https://w3id.org/security/v1",
//       "https://w3id.org/credentials/v1","http://schema.org"
//     ],
//     id: "claimId:a7e0aa7f5b1fe84c9552645c1fd50928ff8ae9f09585",
//     issuer:"did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb",
//     type: ["Credential"],
//     claim: {
//       id: "did:jolo:test",
//       telephone:"011-111"
//     },
//     issued: "2018-05-29T11:05:40.282Z",
//     proof: {
//       type:"EcdsaKoblitzSignature2016",
//       created:"2018-05-29T11:05:40.283Z",
//       creator:"did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb#keys-1",
//       nonce: "b8cc7f31fd875290",
//       signatureValue: "sA3hBXBy3tVjbTBngwZREgMlAlSlEYk3LuzGDqLEdqtdL3BjSgWWR7/Q+ZmTa6DjLNMgfE+Ib+eREM8v+43sqw=="
//     }
//   },
//   {
//     "@context": [
//       "https://w3id.org/identity/v1","https://w3id.org/security/v1",
//       "https://w3id.org/credentials/v1","http://schema.org"
//     ],
//     id: "claimId:a7e0aa7f5b1fe84c9552645c1fd50928ff8ae9f09587",
//     issuer:"did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb",
//     type: ["Credential"],
//     claim: {
//       id: "did:jolo:test",
//       name:"Bobby Fischer"
//     },
//     issued: "2018-05-29T11:05:40.282Z",
//     proof: {
//       type:"EcdsaKoblitzSignature2016",
//       created:"2018-05-29T11:05:40.283Z",
//       creator:"did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb#keys-1",
//       nonce: "b8cc7f31fd875290",
//       signatureValue: "sA3hBXBy3tVjbTBngwZREgMlAlSlEYk3LuzGDqLEdqtdL3BjSgWWR7/Q+ZmTa6DjLNMgfE+Ib+eREM8v+43sqw=="
//     }
//   }
// ]


//const dummyClaims: IVerifiableCredentialAttrs[] = [{
  // '@context': [
  //   "https://w3id.org/identity/v1",
  //   "https://w3id.org/security/v1"
  // ],
  // "id": "http://example.gov/credentials/3732",
  // "type": ["Credential", "PassportCredential"],
  // "name": "Passport",
  // "issuer": "https://example.gov",
  // "issued": "2010-01-01",
  // "claim": {
  //   "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
  //   "name": "Alice Bobman",
  //   "birthDate": "1985-12-14",
  //   "gender": "female",
  //   "favouriteColor": "green",
  //   "nationality": {
  //     "name": "United States"
  //   },
  //   "address": {
  //     "type": "PostalAddress",
  //     "addressStreet": "372 Sumter Lane",
  //     "addressLocality": "Blackrock",
  //     "addressRegion": "Nevada",
  //     "postalCode": "23784",
  //     "addressCountry": "US"
  //   },
  //   "passport": {
  //     "type": "Passport",
  //     "name": "United States Passport",
  //     "documentId": "123-45-6789",
  //     "issuer": "https://example.gov",
  //     "issued": "2010-01-07T01:02:03Z",
  //     "expires": "2020-01-07T01:02:03Z"
  //   }
  // },
  //  "proof": {
  //   "type": "LinkedDataSignature2015",
  //   "created": "2010-01-07T01:02:03Z",
  //   "creator": "https://example.com/jdoe/keys/1",
  //     "domain": "json-ld.org",
  //     "nonce": "c168dfab",
  //     "signatureValue": "jz4bEW2FBMDkANyEjiPnrIctucHQCIwxrtzBXt+rVGmYMEflHrOwf7FYLH60E3Oz54VwSSQCi9J4tXQIhv4SofT5opbcIUj7ji6QrC6c+a3YLjg8l/+/uFjhzsLelAO4gh2k0FJxM04ljH0GZGuXTzhRnqTzJTnYSVo72PC92NA="
  //   }
  // },
  // {
  //   '@context': [
  //     "https://w3id.org/identity/v1",
  //     "https://w3id.org/security/v1"
  //   ],
  //   "id": "http://example.gov/credentials/3732",
  //   "type": ["Credential", "EmailCredential"],
  //   "issuer": "https://example.gov",
  //   "issued": "2010-01-01",
  //  "claim": {
  //     "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
  //     "email": "n@t.world",
  //   },
  //    "proof": {
  //     "type": "LinkedDataSignature2015",
  //     "created": "2010-01-07T01:02:03Z",
  //     "creator": "https://example.com/jdoe/keys/1",
  //     "nonce": "c168dfab",
  //     "signatureValue": "jz4bEW2FBMDkANyEjiPnrIctucHQCIwxrtzBXt+rVGmYMEflHrOwf7FYLH60E3Oz54VwSSQCi9J4tXQIhv4SofT5opbcIUj7ji6QrC6c+a3YLjg8l/+/uFjhzsLelAO4gh2k0FJxM04ljH0GZGuXTzhRnqTzJTnYSVo72PC92NA="
  //   }
  // },
 //    '@context': [
 //      "https://w3id.org/identity/v1",
 //      "https://w3id.org/security/v1"
 //    ],
 //    "id": "http://example.gov/credentials/3732",
 //    "type": ["Credential", "TelephoneCredential"],
 //    "issuer": "https://example.gov",
 //    "issued": "2010-01-01",
 //    "claim": {
 //      "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
 //      "telephone": "000-111-333",
 //    },
 //     "proof": {
 //      "type": "LinkedDataSignature2015",
 //      "created": "2010-01-07T01:02:03Z",
 //      "creator": "https://example.com/jdoe/keys/1",
 //      "nonce": "c168dfab",
 //      "signatureValue": "jz4bEW2FBMDkANyEjiPnrIctucHQCIwxrtzBXt+rVGmYMEflHrOwf7FYLH60E3Oz54VwSSQCi9J4tXQIhv4SofT5opbcIUj7ji6QrC6c+a3YLjg8l/+/uFjhzsLelAO4gh2k0FJxM04ljH0GZGuXTzhRnqTzJTnYSVo72PC92NA="
 //    }
 // }]
