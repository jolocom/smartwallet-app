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
    expectedParams: ['field', 'value']
  },

  saveAttribute: {
    expectedParams: ['field'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.saveAttribute.buildAction(params, async () => {
          const { userData, toggleEdit } = getState().toJS().wallet.identityNew
          const { field } = params
          const did = await services.storage.getItem('did')
          const encWif = await services.storage.getItem('genericKeyWIF')

          // eslint-disable-next-line
          dispatch(actions.toggleEditField({field: [field], value: toggleEdit.bool}))
          let wif
          try {
            // eslint-disable-next-line
            const decryptionPass = await services.storage.getItemSecure('encryptionPassword')
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
            {id: did, [field]: userData[field]},
            wif
          )
          await services.storage.setItem(field, selfSignedClaim)
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
