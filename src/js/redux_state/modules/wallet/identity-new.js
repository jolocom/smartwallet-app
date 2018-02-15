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
          const { userData, toggleEdit } = getState().toJS().wallet.identityNew
          const {field} = params

          dispatch(actions.toggleEditField({ [field]: toggleEdit.bool }))

          const promises = [
            services.storage.getItem('did'),
            services.storage.getItem('tempGenericKeyWIF')
          ]

          return Promise.all(promises).then((res) => {
            const [did, wif] = res

            // eslint-disable-next-line
            const selfSignedClaim = backend.jolocomLib.claims.createVerifiedCredential(
              did,
              field,
              {id: did, [field]: userData[field]},
              wif
            )

            return services.storage.setItem(field, selfSignedClaim)
          })
        }))
      }
    }
  },
  retrieveAttributes: {
    expectedParams: ['claims'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) =>
        dispatch(actions.retrieveAttributes.buildAction(params, () =>
          Promise.all(params.claims.map(claim =>
            services.storage.getItem(claim)
          ))
        ))
    }
  },
  veryfyAttribute: {
    expectedParams: []
  },
  changePinValue: {
    expectedParams: ['attrType', 'value', 'index', 'codeType']
  },
  setFocusedPin: {
    expectedParams: ['value', 'index']
  },
  setSmsVerificationCodeStatus: {
    expectedParams: ['field', 'index', 'value']
  },

})


const initialState = Immutable.fromJS({
  toggleEdit: {
    field: '',
    bool: false,
    verified: false

  },
  userData: {
    phone: {
      value: '',
      verifiable: true,
      verified: false,
      smsCode: '',
      pin: '',
      pinFocused: false,
      codeIsSent: false
    },
    name: {
      value: '',
      verifiable: false,
      verified: false
    },
    email: {
      value: '',
      verifiable: true,
      verified: false,
      smsCode: '',
      codeIsSent: false
    }
  },
  qrscan: false,
  errorMsg: '',
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
        userData: {[action.field]: { value: action.value} }
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

    case actions.changePinValue.id:
      return changePinValue(state, action)

    case actions.setFocusedPin.id:
      return state.setIn(['userData', 'isCodeInputFieldFocused'], action.value)

    case actions.setSmsVerificationCodeStatus.id:
      return state.mergeIn(['userData', action.field, action.index], {
        codeIsSent: action.value
      })

    default:
      return state
  }
}

const _resolveClaims = (action) => {
  let claimsUser = {}
  action.claims.map((claimType, i) => {
    if (action.result[i] !== null && action.result[i] !== undefined) {
      claimsUser[claimType] = action.result[i].value.credential.claim[claimType]
    }
  })
  return claimsUser
}
