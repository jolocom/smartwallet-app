import { AnyAction, Dispatch } from 'redux'
import { navigationActions, genericActions } from 'src/actions/'
import { BackendMiddleware } from 'src/backendMiddleware'
import { routeList } from 'src/routeList'

interface IDefMap {
  [key: string]: string
}

const categoryUIDefinition : IDefMap = {
  name: 'personal',
  dateOfBirth: 'personal',
  email: 'contact',
  phone: 'contact',
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
        claimType: 'name',
        claimValue: 'natascha'
      },
      {
        claimType: 'email',
        claimValue: 'n@t.de'
      },
      {
        claimType: 'phone',
        claimValue: '111-222'
      },
      {
        claimType: 'favourite color',
        claimValue: 'green'
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
  //TODO: flatten retrieved claims from DB for UI purposes

  claims.map((claim: any, i: number) => {
    claim['category'] = categoryUIDefinition[claim.claimType] === undefined ?
      'other' :
      categoryUIDefinition[claim.claimType]
  })
  const orderedClaims = arrayToObject(claims, 'category')
  const allClaimCategories = Object.keys(orderedClaims)
  orderedClaims['claimCategories'] = allClaimCategories

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
