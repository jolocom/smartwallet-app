import { AnyAction, Dispatch } from 'redux'
import { JolocomLib } from 'jolocom-lib'
import { navigationActions, genericActions } from 'src/actions/'
import { BackendMiddleware } from 'src/backendMiddleware'
import { routeList } from 'src/routeList'
import { DecoratedClaims, CategorizedClaims } from 'src/reducers/account'
import { categoryForType } from 'src/actions/account/categories'
import { IVerifiableCredentialAttrs } from 'jolocom-lib/js/credentials/verifiableCredential/types'
import { claimsMetadata } from 'jolocom-lib'

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
        dispatch(genericActions.toggleLoadingScreen(false))
        return
      }

      dispatch(setDid(personas[0].did))
      dispatch(genericActions.toggleLoadingScreen(false))
      dispatch(navigationActions.navigatorReset( 
        { routeName: routeList.Home }
      ))

    } catch(err) {
      if (err.message.indexOf('no such table') === 0) {
        return
      }
      dispatch(genericActions.showErrorScreen(err))
    }
  }
}

export const openClaimDetails = (claim: DecoratedClaims) => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch({
      type: 'SET_SELECTED',
      selected: claim
    })
    dispatch(navigationActions.navigate({
      routeName: routeList.ClaimDetails
    }))
  }
}

export const saveClaim = (claimsItem: DecoratedClaims) => {
  return async (dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware : BackendMiddleware) => {
    const state = getState()
    const jolocomLib = new JolocomLib()
    let newClaims = {}

    newClaims = state.account.claims.toJS().claims

    // TODO: change the key of claimsMetadata to be the type[1]
    let claimsMetadataType = ''
    switch(claimsItem.type[1]) {
      case 'ProofOfNameCredential':
        claimsMetadataType = 'name'
      case 'ProofOfMobilePhoneNumberCredential':
        claimsMetadataType = 'mobilePhoneNumber'
      case 'ProofOfEmailCredential':
        claimsMetadataType = 'emailAddress'
    }

    const credential = jolocomLib.credentials.createCredential(
      claimsMetadata[claimsMetadataType],
      claimsItem.claims[0].value,
      state.account.did.toJS().did
    )
    console.log(credential)
    // TODO: add signature

    let category = ''
    Object.keys(categoryForType).forEach(cat => {
      if (typeInCategory(cat, claimsItem.type)) { category = cat }
    })

    newClaims[category].forEach((claim: DecoratedClaims) => {
      if (areCredTypesEqual(claim.type, claimsItem.type)) {
        newClaims[category].splice(claim)
        newClaims[category].push(claimsItem as DecoratedClaims)
      }
    })

    dispatch({
      type: 'SET_CLAIMS_FOR_DID',
      claims: newClaims
    })
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

export const setClaimsForDid = () => {
  return async (dispatch: Dispatch<AnyAction>, getState: Function) => {
    const state = getState().account.claims.toJS()
    dispatch(toggleLoading(!state.loading))

    // TODO: Fetch claims from the DB
    const claims = prepareClaimsForState(dummyC) as CategorizedClaims

    dispatch({
        type: 'SET_CLAIMS_FOR_DID',
        claims
    })
  }
}

const prepareClaimsForState = (claims: IVerifiableCredentialAttrs[]) => {
  // TODO: Handle the category 'Other' for the claims that don't match any of predefined categories
  let categorizedClaims = {}
  const jolocomLib = new JolocomLib()

  Object.keys(categoryForType).forEach(category => {
    let claimsForCategory : DecoratedClaims[] = []

    claims.forEach(claim => {
      // TODO: clean up after using the DB and thus VerifiableCredential[] as a param of this method
      const VerifiableCredential = jolocomLib.credentials.createVerifiableCredential().fromJSON(claim)
      const name = VerifiableCredential.getDisplayName()
      const fieldName = Object.keys(VerifiableCredential.getCredentialSection())[1]
      const value = VerifiableCredential.getCredentialSection()[fieldName]

      if (typeInCategory(category, claim.type)) {
        claimsForCategory.push(
          { displayName: name,
            type: claim.type,
            claims: [
              { id: claim.id,
                name: fieldName,
                value: value }
            ]
          } as DecoratedClaims
        )
      }
    })

    categorizedClaims[category] = claimsForCategory
  })
  return categorizedClaims
}

// TODO: use the method from JolocomLib
const areCredTypesEqual = (first: string[], second: string[]): boolean => {
  return first.every((el, index) => el === second[index])
}

const typeInCategory = (category: string, type: string[]): boolean => {
  const found = categoryForType[category].find(t => areCredTypesEqual(type, t))
  return (found && found.length > 0) || false
}

const dummyC : any[]  = [
  {
    "@context": [
      "https://w3id.org/identity/v1","https://w3id.org/security/v1",
      "https://w3id.org/credentials/v1","http://schema.org"
    ],
    id: "claimId:a7e0aa7f5b1fe84c9552645c1fd50928ff8ae9f09580",
    name: 'E-mail',
    issuer:"did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb",
    type: ["Credential", "ProofOfEmailCredential"],
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
    name: 'Phone',
    issuer:"did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb",
    type: ["Credential", "ProofOfMobilePhoneNumberCredential"],
    claim: {
      id: "did:jolo:test",
      phone:"011-111"
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
    name: 'Name',
    issuer:"did:jolo:8f977e50b7e5cbdfeb53a03c812913b72978ca35c93571f85e862862bac8cdeb",
    type: ["Credential", "ProofOfNameCredential"],
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
