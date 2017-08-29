import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'
import * as transition from './transition'

const verificationStartUrl = '/verifier/document'
const dataCheckUrl = 'verifier/data'

import WalletCrypto from 'smartwallet-contracts/lib/wallet-crypto'

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
          const {verifier} = getState().toJS()
          const {type} = verifier.document
          const verifieeIdentityURL = 'https://identity.jolocom.com/' +
          verifier.data.username
          let idcardIndex = await services.auth.currentUser.wallet.proxyGet(
            verifieeIdentityURL + '/identity/idcard'
          )
          let data = verifier.data[type]
          const { city, country, state, streetWithNumber, zip } =
            data.physicalAddress
          const serializedIdCard = (new WalletCrypto()).serializeData({
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
          const result = await services.auth.currentUser.wallet.verify({
            identity: verifieeIdentityURL,
            attributeType: 'idcard',
            attributeId: idcardIndex[0],
            attributeValue: serializedIdCard
          })
          return result.ok
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
