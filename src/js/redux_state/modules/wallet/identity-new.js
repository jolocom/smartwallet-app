import Immutable from 'immutable'
import { makeActions } from '../'

export const actions = makeActions('wallet/identityNew', {
  toggleEditField: {
    expectedParams: ['value', 'field']
  },
  toggleQRScan: {
    expectedParams: ['value']
  },
  enterField: {
    expectedParams: ['field', 'value']
  },
  saveAttribute: {
    expectedParams: ['field'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        const userData = getState().toJS().wallet.identityNew.userData
        const toogle = getState().toJS().wallet.identityNew.toggleEdit.bool

        dispatch(actions.saveAttribute.buildAction(params, () => {
          const property = params.field
          dispatch(actions.toggleEditField({[params.field]: toogle}))
          return services.storage.setItem(property, userData[params.field])
        }))
      }
    }
  },
  retrieveAttribute: {
    expectedParams: ['claims'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.retrieveAttribute.buildAction(params, () => {
          let claimsArray = []
          params.claims.map((claim) => {
            claimsArray.push(services.storage.getItem(claim))
          })
          return Promise.all(claimsArray)
        }))
      }
    }
  }
})

const initialState = Immutable.fromJS({
  toggleEdit: {
    field: '',
    bool: false
  },
  userData: {
    phone: '',
    name: '',
    email: ''
  },
  qrscan: false,
  errorMsg: ''
})

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.toggleEditField.id:
      return state.mergeDeep({
        toggleEdit: {
          field: action.field,
          bool: !action.value
        }
      })

    case actions.toggleQRScan.id:
      return state.mergeDeep({
        qrscan: !action.value
      })

    case actions.enterField.id:
      return state.mergeDeep({
        userData: {[action.field]: action.value}
      })

    case actions.saveAttribute.id:
      return state

    case actions.saveAttribute.id_success:
      return state.mergeDeep({
        errorMsg: ''
      })

    case actions.saveAttribute.id_fail:
      return state.mergeDeep({
        errorMsg: 'Could not save attribute on device.'
      })

    case actions.retrieveAttribute.id:
      return state

    case actions.retrieveAttribute.id_success:
      const retrievedData = _resolveClaims(action)
      return state.mergeDeep({
        userData: retrievedData
      })

    case actions.retrieveAttribute.id_fail:
      return state.mergeDeep({
        errorMsg: 'Could not retrieve claims from device.'
      })

    default:
      return state
  }
}

const _resolveClaims = (action) => {
  let claimsUser = {}
  action.claims.map((claimType, i) => {
    claimsUser[claimType] = action.result[i]
  })
  return claimsUser
}

// structure of the claim:
// public '@context': string = "https://w3id.org/credentials/v1"
// public id: string
// public 'type': string[]
// public issuer: string
// public issued: string
// public claim: { id: string; [x:string]:any }
// public proof: string
