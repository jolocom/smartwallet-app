import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'
import * as transition from './transition'
import util from 'lib/util'

const verificationStartUrl = '/verification/document'
const dataCheckUrl = 'verification/data'

import WalletCrypto from 'smartwallet-contracts/lib/wallet-crypto'

const compareDataToIdCard = async ({contractId, data, wallet, documentType}) => { // eslint-disable-line max-len
  const storedHash = await wallet.getAttributeHash({
    identityAddress: contractId,
    attributeId: documentType
  })
  console.log('document type: ', documentType)
  console.log('hash retrieved: ', storedHash)

  const { city, country, state, streetWithNumber, zip } = data.physicalAddress

  const calculatedHash = (new WalletCrypto()).calculateDataHash({
    birthCountry: data.birthCountry.value,
    birthDate: data.birthDate.value,
    birthPlace: data.birthPlace.value,
    expirationDate: data.expirationDate.value,
    firstName: data.firstName.value,
    gender: data.gender.value,
    lastName: data.lastName.value,
    number: data.number.value,
    city: city.value,
    country: country.value,
    state: state.value,
    streetWithNumber: streetWithNumber.value,
    zip: zip.value
  })

  console.log('calculated Hash: ', calculatedHash)

  if (storedHash !== calculatedHash) {
    return false
  }
  return true
}

const storeVerificationToTargetIdentity = ({contractId, wallet}) => {
  return wallet.addVerificationToTargetIdentity({ // eslint-disable-line max-len
    targetIdentityAddress: contractId,
    attributeId: 'idCard',
    pin: '1234'
  })
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
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.startComparingData.buildAction(params, async () => {
          const {verification} = getState().toJS()
          const {type} = verification.document

          const webId = util.usernameToWebId(verification.data.username)
          const contractId = await backend
            .solid.getIdentityContractAddress(webId)

          const {wallet} = services.auth.currentUser
          return compareDataToIdCard({
            contractId,
            wallet,
            data: verification.data[type],
            documentType: type
          }).then(result => {
            if (result) {
              console.log('=================')
              storeVerificationToTargetIdentity({wallet, contractId})
            }
            return result
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
      console.log('===success===', action.result)
      return state.merge({
        loading: false,
        success: action.result,
        numberOfFails: state.get('numberOfFails') + !action.result
      })
    case actions.startComparingData.id_fail:
      console.error('Error : ', action.result) // eslint-disable-line
      return state
    default:
      return state
  }
}
