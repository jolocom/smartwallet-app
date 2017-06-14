import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'
import * as transition from './transition'

const verificationStartUrl = '/verification/document'
const dataCheckUrl = 'verification/data'

import WalletCrypto from 'smartwallet-contracts/lib/wallet-crypto'

const compareDataToIdCard = async ({contractId, data, wallet, documentType}) => { // eslint-disable-line max-len
  const storedHash = await wallet.getAttributeHash({
    identityAddress: contractId,
    attributeId: documentType
  })
  const calculatedHash = (new WalletCrypto()).calculateDataHash({
    number: data.number,
    expirationDate: data.expirationDate,
    givenName: data.givenName,
    familyName: data.familyName,
    birthDate: data.birthDate,
    birthPlace: data.birthPlace,
    birthCountry: data.birthCountry
  })
  if (storedHash !== calculatedHash) {
    console.error('The supplied details do not match stored ID Card details')  // eslint-disable-line
    return false
  }
  await wallet.addVerificationToTargetIdentity({
    targetIdentityAddress: contractId,
    attributeId: 'passport',
    password: '1234'
  })
  return true
}

const actions = module.exports = makeActions('wallet/contact', {
  finishVerification: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch) => {
        dispatch(actions.finishVerification.buildAction(params))
        dispatch(transition.setCurrentStep('face'))
        dispatch(router.pushRoute(verificationStartUrl))
      }
    }
  },
  startComparingData: {
    async: true,
    expectedParams: ['data'],
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.startComparingData.buildAction(params, () => {
          const {verification} = getState().toJS()
          const {type} = verification.document
          const contractId = ''
          const {wallet} = services.auth.currentUser
          compareDataToIdCard({
            contractId,
            wallet,
            data: verification.data[type],
            documentType: type
          })
        }))
      }
    }
  },
  startDataCheck: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch) => {
        dispatch(transition.setCurrentStep('data'))
        dispatch(router.pushRoute(dataCheckUrl))
        dispatch(actions.startDataCheck.buildAction(params))
      }
    }
  }
})

const initialState = Immutable.fromJS({
  loading: true,
  success: false,
  numberOfFails: 0
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.startComparingData.id:
      return state.merge({
        loading: true
      })
    case actions.startComparingData.id_success:
      return state.merge({
        loading: false,
        success: true,
        numberOfFails: 0
      })
    case actions.startComparingData.id_fail:
      return state.merge({
        loading: false,
        success: false,
        numberOfFails: state.get('numberOfFails') + 1
      })
    default:
      return state
  }
}
