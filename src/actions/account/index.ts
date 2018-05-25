import { AnyAction, Dispatch } from 'redux'
import { navigationActions, genericActions } from 'src/actions/'
import { BackendMiddleware } from 'src/backendMiddleware'
import { routeList } from 'src/routeList'

interface IDefMap {
  [key: string]: string
}

const categoryUIDefinition : IDefMap = {
  name: 'personal',
  birthDate: 'personal',
  gender: 'personal',
  email: 'contact',
  telephone: 'contact',
  socialMedia: 'contact'
}

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
      const personas = await storageLib.getPersonas()
      if (!personas.length) {
        return
      }

      dispatch(setDid(personas[0].did))
      dispatch(navigationActions.navigate({
        routeName: routeList.Identity
      }))
    } catch(err) {
      if (err.message.indexOf('no such table') === 0) {
        return
      }

      dispatch(genericActions.showErrorScreen(err))
    }
  }
}

export const toggleLoading = (val: boolean) => {
  return {
    type: 'SET_LOADING',
    loading: val
  }
}

export const getClaimsForDid = () => {
  return (dispatch: Dispatch<AnyAction>, getState: Function) => {
    const state = getState().account.claims.toJS()
    dispatch(toggleLoading(!state.loading))

    const dummyClaims = [
      {
        "@context": [
          "https://w3id.org/identity/v1",
          "https://w3id.org/security/v1"
        ],
        "id": "http://example.gov/credentials/3732",
        "type": ["Credential", "PassportCredential"],
        "name": "Passport",
        "issuer": "https://example.gov",
        "issued": "2010-01-01",
        "claim": {
          "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
          "name": "Alice Bobman",
          "birthDate": "1985-12-14",
          "gender": "female",
          "favouriteColor": "green",
          "nationality": {
            "name": "United States"
          },
          "address": {
            "type": "PostalAddress",
            "addressStreet": "372 Sumter Lane",
            "addressLocality": "Blackrock",
            "addressRegion": "Nevada",
            "postalCode": "23784",
            "addressCountry": "US"
          },
          "passport": {
            "type": "Passport",
            "name": "United States Passport",
            "documentId": "123-45-6789",
            "issuer": "https://example.gov",
            "issued": "2010-01-07T01:02:03Z",
            "expires": "2020-01-07T01:02:03Z"
          }
        },
         "signature": {
          "type": "LinkedDataSignature2015",
          "created": "2016-06-21T03:43:29Z",
          "creator": "https://example.com/jdoe/keys/1",
          "domain": "json-ld.org",
          "nonce": "c168dfab",
          "signatureValue": "jz4bEW2FBMDkANyEjiPnrIctucHQCIwxrtzBXt+rVGmYMEflHrOwf7FYLH60E3Oz54VwSSQCi9J4tXQIhv4SofT5opbcIUj7ji6QrC6c+a3YLjg8l/+/uFjhzsLelAO4gh2k0FJxM04ljH0GZGuXTzhRnqTzJTnYSVo72PC92NA="
        }
      },
      {
        "@context": [
          "https://w3id.org/identity/v1",
          "https://w3id.org/security/v1"
        ],
        "id": "http://example.gov/credentials/3732",
        "type": ["Credential", "EmailCredential"],
        "issuer": "https://example.gov",
        "issued": "2010-01-01",
        "claim": {
          "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
          "email": "n@t.world",
        },
         "signature": {
          "type": "LinkedDataSignature2015",
          "created": "2016-06-21T03:43:29Z",
          "creator": "https://example.com/jdoe/keys/1",
          "domain": "json-ld.org",
          "nonce": "c168dfab",
          "signatureValue": "jz4bEW2FBMDkANyEjiPnrIctucHQCIwxrtzBXt+rVGmYMEflHrOwf7FYLH60E3Oz54VwSSQCi9J4tXQIhv4SofT5opbcIUj7ji6QrC6c+a3YLjg8l/+/uFjhzsLelAO4gh2k0FJxM04ljH0GZGuXTzhRnqTzJTnYSVo72PC92NA="
        }
      },
      {
        "@context": [
          "https://w3id.org/identity/v1",
          "https://w3id.org/security/v1"
        ],
        "id": "http://example.gov/credentials/3732",
        "type": ["Credential", "TelephoneCredential"],
        "issuer": "https://example.gov",
        "issued": "2010-01-01",
        "claim": {
          "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
          "telephone": "000-111-333",
        },
         "signature": {
          "type": "LinkedDataSignature2015",
          "created": "2016-06-21T03:43:29Z",
          "creator": "https://example.com/jdoe/keys/1",
          "domain": "json-ld.org",
          "nonce": "c168dfab",
          "signatureValue": "jz4bEW2FBMDkANyEjiPnrIctucHQCIwxrtzBXt+rVGmYMEflHrOwf7FYLH60E3Oz54VwSSQCi9J4tXQIhv4SofT5opbcIUj7ji6QrC6c+a3YLjg8l/+/uFjhzsLelAO4gh2k0FJxM04ljH0GZGuXTzhRnqTzJTnYSVo72PC92NA="
        }
      }

    ]

    const claims = prepareClaimsForState(dummyClaims)
    dispatch({
        type: 'GET_CLAIMS_DID',
        claims: claims
    })
  }

  // TODO: connect to storageLib
  // return async (dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware: BackendMiddleware) => {
    // const { storageLib } = backendMiddleware
    // try {
    //   // await storageLib...
    // } catch(err) {
    //   dispatch(genericActions.showErrorScreen(err))
    // }
  // }
}

const prepareClaimsForState = (claims: any) => {
  let preparedClaims : any = []

  claims.map((claim: any, i: number) => {
    let singleClaim : any = {}
    singleClaim['id'] = claim.id
    singleClaim['type'] = claim.type[1]

    let nestedClaims = Object.keys(claim.claim)
    let ix = nestedClaims.indexOf('id')
    nestedClaims.splice(ix, 1)

    nestedClaims.map((nest) => {
      let nestedInfo : any = {}
      nestedInfo['claimField'] = nest
      nestedInfo['claimValue'] = claim.claim[nest]
      typeof claim.claim[nest] === 'string' ?
        nestedInfo['multiLine'] = false :
        nestedInfo['multiLine'] = true

      nestedInfo['category'] = categoryUIDefinition[nest] === undefined ?
        'other' :
        categoryUIDefinition[nest]

      preparedClaims.push(Object.assign({}, singleClaim, nestedInfo))
    })
  })

  const orderedClaims = arrayToObject(preparedClaims, 'category')
  return orderedClaims
}


const arrayToObject = (claimsArray: any, category: string) => {
  return claimsArray.reduce((accumulator : any, claimItem: any) => {
    if (accumulator[claimItem[category]]) {
      accumulator[claimItem[category]].push(claimItem)
    } else {
      accumulator[claimItem[category]] = [claimItem]
    }
    return accumulator
  }, {} )
}
