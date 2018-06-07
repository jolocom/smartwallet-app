import { AnyAction, Dispatch } from 'redux'
import { navigationActions, genericActions } from 'src/actions/'
import { BackendMiddleware } from 'src/backendMiddleware'
import { routeList } from 'src/routeList'
import { DecoratedClaims, CategorizedClaims } from 'src/reducers/account'
import { categoryForType } from 'src/actions/account/categories'
import { claimsMetadata } from 'jolocom-lib'
import { VerifiableCredential } from 'jolocom-lib/js/credentials/verifiableCredential'
import { initialState } from 'src/reducers/account/claims'

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
      dispatch(navigationActions.navigate({ routeName: routeList.Claims }))
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
    const { jolocomLib, storageLib, keyChainLib, encryptionLib, ethereumLib } = backendMiddleware
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
    const verifiableCredential = await wallet.signCredential(credential)
    console.log(verifiableCredential)
    console.log(claimsItem.claims[0].id)

    if (claimsItem.claims[0].id) {
      await storageLib.delete.verifiableCredential(claimsItem.claims[0].id)
    }
    await storageLib.store.verifiableCredential(verifiableCredential)

    dispatch({
      type: 'SET_CLAIMS_FOR_DID',
      claims: newClaims
    })
    dispatch(navigationActions.navigate({
      routeName: routeList.Claims
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
  return async (dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware: BackendMiddleware) => {
    const state = getState().account.claims.toJS()
    dispatch(toggleLoading(!state.loading))
    const storageLib = backendMiddleware.storageLib

    const verifiableCredentials: VerifiableCredential[] = await storageLib.get.verifiableCredential()
    const claims = prepareClaimsForState(verifiableCredentials) as CategorizedClaims

    dispatch({
        type: 'SET_CLAIMS_FOR_DID',
        claims
    })
  }
}

const prepareClaimsForState = (claims: VerifiableCredential[]) => {
  // TODO: Handle the category 'Other' for the claims that don't match any of predefined categories
  let categorizedClaims = {}
  const initialClaimsState = initialState

  Object.keys(categoryForType).forEach(category => {
    let claimsForCategory : DecoratedClaims[] = []

    claims.forEach(claim => {
      const name = claim.getDisplayName()
      const fieldName = Object.keys(claim.getCredentialSection())[1]
      const value = claim.getCredentialSection()[fieldName]
      console.log(claim)

      if (typeInCategory(category, claim.getType())) {
        claimsForCategory.push(
          { displayName: name,
            type: claim.getType(),
            claims: [
              { id: claim.getId(),
                name: fieldName,
                value: value }
            ]
          } as DecoratedClaims
        )
      }
    })
    if (claimsForCategory.length === 0) {
      categorizedClaims[category] = initialClaimsState.claims[category]
    } else {
      initialClaimsState.claims[category].forEach(claim => {
        let count = 0
        claimsForCategory.forEach(dbClaim => {
          if (areCredTypesEqual(claim.type, dbClaim.type)) {
            count++
          }
        })
        if(count === 0) {
          claimsForCategory.push(claim)
        }
      })
      categorizedClaims[category] = claimsForCategory
    }
  })
  console.log(categorizedClaims)
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
