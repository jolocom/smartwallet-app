import { AnyAction, Dispatch } from 'redux'
import { genericActions, navigationActions } from 'src/actions/'
import { BackendMiddleware } from 'src/backendMiddleware'
import { routeList } from 'src/routeList'
import { DecoratedClaims } from 'src/reducers/account'
// import { VerifiableCredential } from 'jolocom-lib/js/credentials/verifiableCredential'
// import { getClaimMetadataByCredentialType, getCredentialUiCategory } from '../../lib/util'

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
  return async (dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware: BackendMiddleware) => {
    // const state = getState()
    // const { jolocomLib, storageLib, keyChainLib, encryptionLib, ethereumLib } = backendMiddleware

    // const credential = jolocomLib.credentials.createCredential(
    //   getClaimMetadataByCredentialType(claimsItem.type),
    //   claimsItem.claims[0].value.trim(),
    //   state.account.did.toJS().did
    // )

    // const currentDid = getState().account.did.get('did')
    // const encryptionPass = await keyChainLib.getPassword()
    // const personaData = await storageLib.get.persona({ did: currentDid })
    // const { encryptedWif } = personaData[0].controllingKey
    // const decryptedWif = encryptionLib.decryptWithPass({
    //   cipher: encryptedWif,
    //   pass: encryptionPass
    // })
    // const { privateKey } = ethereumLib.wifToEthereumKey(decryptedWif)

    // const wallet = jolocomLib.wallet.fromPrivateKey(Buffer.from(privateKey, 'hex'))
    // const verifiableCredential = await wallet.signCredential(credential)

    // if (claimsItem.claims[0].id) {
    //   await storageLib.delete.verifiableCredential(claimsItem.claims[0].id)
    // }

    // await storageLib.store.verifiableCredential(verifiableCredential)

    // await setClaimsForDid()

    dispatch(navigationActions.navigatorReset({
      routeName: routeList.Home
    }))
  }
}

export const toggleLoading = (val: boolean) => {
  return {
    type: 'SET_LOADING',
    loading: val
  }
}

// Why is this named set and not get?
export const setClaimsForDid = () => {
  return async (dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware: BackendMiddleware) => {
    // const state = getState().account.claims.toJS()
    // dispatch(toggleLoading(!state.loading))
    // const storageLib = backendMiddleware.storageLib

    // const verifiableCredentials: SignedCredential[] = await storageLib.get.verifiableCredential()
    // const claims = prepareClaimsForState(verifiableCredentials) as CategorizedClaims

    // dispatch({
    //     type: 'SET_CLAIMS_FOR_DID',
    //     claims
    // })
  }
}

// const prepareClaimsForState = (credentials: VerifiableCredential[]) => {
//   const categorizedClaims = {}

//   const decoratedCredentials = credentials.map(vCred => {
//     const claimData = vCred.getCredentialSection()
//     const claimFieldName = Object.keys(claimData).filter(key => key !== 'id')[0]

//     return {
//       displayName: vCred.getDisplayName(),
//       type: vCred.getType(),
//       claims: [{
//         id: vCred.getId(),
//         name: claimFieldName,
//         value: claimData[claimFieldName]
//       }]
//     }
//   })

//   decoratedCredentials.forEach(decoratedCred => {
//     const uiCategory = getCredentialUiCategory(decoratedCred.type)

//     try {
//       categorizedClaims[uiCategory].push(decoratedCred)
//     } catch (err) {
//       categorizedClaims[uiCategory] = [decoratedCred]
//     }
//   })

//   return categorizedClaims
// }
