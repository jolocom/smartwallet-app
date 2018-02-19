import Immutable from 'immutable'
import * as qr from 'lib/qr-scanner'
import { makeActions } from '../'

export const actions = makeActions('wallet/identityNew', {
  toggleEditField: {
    expectedParams: ['value', 'field']
  },

  toggleQRScan: {
    expectedParams: [],
    creator: () => {
      return async (dispatch, getState, {services, backend}) => {
        // eslint-disable-next-line
        const isScanning = getState().toJS().wallet.identityNew.scanningQr.scanning

        if (isScanning) {
          qr.cleanUp()
          return dispatch(actions.toggleQRScan.buildAction())
        } else {
          qr.showCameraOutput()
          dispatch(actions.toggleQRScan.buildAction())

          const message = await qr.scanMessage()
          // TODO: finish auth process
          dispatch(actions.setScannedValue({scannedValue: message}))

          dispatch(actions.toggleQRScan.buildAction())
          return qr.cleanUp()
        }
      }
    }
  },

  setScannedValue: {
    expectedParams: ['scannedValue']
  },

  enterField: {
    expectedParams: ['attrType', 'field', 'value']
  },

  saveAttribute: {
    expectedParams: ['field'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.saveAttribute.buildAction(params, async () => {
          const { userData, toggleEdit } = getState().toJS().wallet.identityNew
          const { field } = params
          // eslint-disable-next-line

          dispatch(actions.toggleEditField({field: [field], value: toggleEdit.bool}))

          const did = await services.storage.getItem('did')
          const encWif = await services.storage.getItem('genericKeyWIF')

          let wif
          try {
            const decryptionPass = await services.storage
              .getItemSecure('encryptionPassword')
            wif = await backend.encryption.decryptInformation({
              ciphertext: encWif.crypto.ciphertext,
              password: decryptionPass,
              salt: encWif.crypto.kdfParams.salt,
              iv: encWif.crypto.cipherparams.iv
            })
          } catch (err) {
            console.warn(err)
            wif = await services.storage.getItem('tempGenericKeyWIF')
          }

          // eslint-disable-next-line
          const selfSignedClaim = backend.jolocomLib.claims.createVerifiedCredential(
            did,
            field,
            { id: did, [field]: userData[field].value },
            wif
          )

          let userClaims = await services.storage.getItem(field)
          // eslint-disable-next-line
          let sortedClaims = _preventDoubleEntry({userClaims, selfSignedClaim, did, userData, field})

          if (sortedClaims.itemToRemove) {
            await services.storage.removeItem(sortedClaims.itemToRemove)
          }

          await services.storage.setItem(field, sortedClaims.result)
          // eslint-disable-next-line
          const res = await services.storage.setItem(selfSignedClaim.credential.id, selfSignedClaim)
          return res
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
    expectedParams: ['field', 'value']
  }
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
      codeIsSent: false,
      isCodeInputFieldFocused: false
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
  scanningQr: {
    scanning: false,
    scannedValue: ''
  },
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

    case actions.setScannedValue.id:
      return state.setIn(['scanningQr', 'scannedValue'], action.scannedValue)

    case actions.toggleQRScan.id:
      return state.setIn(
        ['scanningQr', 'scanning'],
        !state.getIn(['scanningQr', 'scanning'])
      )

    case actions.enterField.id:
      return state.setIn(['userData', action.attrType, action.field], action.value)

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
      return state.setIn(['userData', action.field, 'codeIsSent'], action.value)

    default:
      return state
  }
}

const _resolveClaims = (action) => {
  let claimsUser = {}
  action.claims.map((claimType, i) => {
    if (action.result[i]) {
      claimsUser[claimType] = {
        value: action.result[i].value,
        claims: action.result[i].claims
      }
    }
  })

  return claimsUser
}

// eslint-disable-next-line
const _preventDoubleEntry = ({userClaims, selfSignedClaim, userData, field, did}) => {
  let itemToRemove
  if (userClaims != null) {
    userClaims.value = userData[field].value
    userClaims.claims.map((claim, i) => {
      if (claim.issuer === did) {
        itemToRemove = claim.id
        userClaims.claims.splice(i)
      }
      userClaims.claims.push({
        id: selfSignedClaim.credential.id,
        issuer: selfSignedClaim.credential.issuer
      })
    })
  } else {
    userClaims = {
      value: userData[field].value,
      claims: [{
        id: selfSignedClaim.credential.id,
        issuer: selfSignedClaim.credential.issuer
      }]
    }
  }
  return {result: userClaims, itemToRemove}
}