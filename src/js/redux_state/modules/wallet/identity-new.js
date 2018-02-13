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
        dispatch(actions.saveAttribute.buildAction(params, () => {
          const userData = getState().toJS().wallet.identityNew.userData
          const toggle = getState().toJS().wallet.identityNew.toggleEdit.bool
          const property = params.field
          dispatch(actions.toggleEditField({[property]: toggle}))
          const promise1 = services.storage.getItem('did')
          const promise2 = services.storage.getItem('tempGenericKeyWIF')
          return Promise.all([promise1, promise2])
          .then((res) => {
            const did = res[0]
            const wif = res[1]
            const selfSignedClaim = backend.jolocomLib.claims.createVerifiedCredential( // eslint-disable-line max-len
              did,
              property,
              {id: did, [property]: userData[property]},
              wif
              )
            console.log('SSCLAIM: ', selfSignedClaim)
            return services.storage.setItem(property, selfSignedClaim)
          })
        }))
      }
    }
  },
  retrieveAttributes: {
    expectedParams: ['claims'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.retrieveAttributes.buildAction(params, () => {
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

    case actions.retrieveAttributes.id:
      return state

    case actions.retrieveAttributes.id_success:
      const retrievedData = _resolveClaims(action)
      return state.mergeDeep({
        userData: retrievedData
      })

    case actions.retrieveAttributes.id_fail:
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
    if (action.result[i] !== null && action.result[i] !== undefined) {
      claimsUser[claimType] = action.result[i].credential.claim[claimType]
    }
  })
  return claimsUser
}
