import Immutable from 'immutable'
import util from 'lib/util'
// import WalletCrypto from 'smartwallet-contracts/lib/wallet-crypto'
import { makeActions } from '../'
import * as router from '../router'
import {listOfCountries as options} from '../../../lib/list-of-countries'
import {
  setPhysicalAddressField,
  checkForNonValidFields,
  storeIdCardDetailsInSolid,
  genderList,
  mapBackendToState,
  changeFieldValue
} from '../../../lib/id-card-util'

const storeIdCardDetailsInBlockchain = ({idCard, services}) => {
  const {wallet} = services.auth.currentUser
  return wallet.addAttributeHashToIdentity(
    {
      attributeId: 'idCard',
      attribute: {
        birthCountry: idCard.idCardFields.birthCountry,
        birthDate: idCard.idCardFields.birthDate,
        birthPlace: idCard.idCardFields.birthPlace,
        expirationDate: idCard.idCardFields.expirationDate,
        firstName: idCard.idCardFields.firstName,
        gender: idCard.idCardFields.gender,
        lastName: idCard.idCardFields.lastName,
        number: idCard.idCardFields.number,
        city: idCard.idCardFields.physicalAddress.city,
        country: idCard.idCardFields.physicalAddress.country,
        state: idCard.idCardFields.physicalAddress.state,
        streetWithNumber: idCard.idCardFields.physicalAddress.streetWithNumber,
        zip: idCard.idCardFields.physicalAddress.zip
      },
      definitionUrl:
      `${util.webidRoot(wallet.webId)}/profile/idCard${idCard.id}`,
      pin: '1234',
      identityAddress: wallet.identityAddress
    }
  )
}

const actions = module.exports = makeActions('wallet/id-card', {
  save: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.validate())
        const {idCard, showErrors} = getState().toJS().wallet.idCard
        const {webId} = getState().toJS().wallet.identity
        if (!showErrors) {
          dispatch(actions.save.buildAction(params, () => {
            return storeIdCardDetailsInSolid({backend, services, idCard, webId})
          })
        ).then(() => {
          dispatch(actions.clearState())
          dispatch(router.pushRoute('/wallet/identity'))
        })
        }
      }
    }
  },
  saveToBlockchain: {
    expectedParams: ['index'],
    async: true,
    creator: (index) => {
      return (dispatch, getState, {services, backend}) => {
        const idCard = getState().toJS().wallet.identity.idCards[index]
        console.log(idCard)
        dispatch(actions.saveToBlockchain.buildAction(index, () => {
          return storeIdCardDetailsInBlockchain({idCard, services})
        }))
      }
    }
  },
  setShowAddress: {
    expectedParams: ['value']
  },
  setFocusedField: {
    expectedParams: ['field', 'group']
  },
  validate: {
    expectedParams: []
  },
  cancel: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch) => {
        dispatch(actions.cancel.buildAction(params))
        dispatch(router.pushRoute('/wallet/identity'))
      }
    }
  },
  retrieveIdCardInformation: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, {services, backend}) => {
        dispatch(actions.retrieveIdCardInformation.buildAction(params,
          () => backend.solid.getIdCardInformation()
        ))
      }
    }
  },
  goToSelectBirthCountry: {
    expectedParams: ['field'],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(router.pushRoute('/wallet/id-card/select-birth-country'))
      }
    }
  },
  goToSelectCountry: {
    expectedParams: ['field'],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(router.pushRoute('/wallet/id-card/select-country'))
      }
    }
  },
  changeIdCardField: {
    expectedParams: ['field', 'value']
  },
  setFoccusedGroup: {
    expectedParams: ['value']
  },
  changePhysicalAddressField: {
    expectedParams: ['field', 'value']
  },
  clearState: {
    expectedParams: []
  }
})

const initialState = module.exports.initialState = Immutable.fromJS({
  loaded: false,
  showErrors: false,
  focusedGroup: '',
  focusedField: '',
  idCard: {
    locations: [{title: '', streetWithNumber: '', zip: '', city: ''}],
    number: {value: '', valid: false},
    expirationDate: {value: '', valid: false},
    firstName: {value: '', valid: false},
    lastName: {value: '', valid: false},
    gender: {value: '', valid: false, options: genderList},
    birthDate: {value: '', valid: false},
    birthPlace: {value: '', valid: false},
    birthCountry: {value: '', valid: false, options},
    showAddress: false,
    physicalAddress: {
      streetWithNumber: {value: '', valid: false},
      zip: {value: '', valid: false},
      city: {value: '', valid: false},
      state: {value: '', valid: false},
      country: {value: '', valid: false, options}
    }
  }
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.cancel.id:
      return initialState

    case actions.changeIdCardField.id:
      return changeFieldValue(state, action)

    case actions.clearState.id:
      return initialState

    case actions.save.id:
      return state.merge({
        loaded: false,
        showErrors: false
      })

    case actions.save.id_fail:
      return state.merge({
        showErrors: true,
        loaded: true
      })

    case actions.setShowAddress.id:
      return state.mergeIn(['idCard'], {
        showAddress: action.value
      })

    case actions.save.id_success:
      return state.merge({
        loaded: true,
        showErrors: false
      })

    case actions.retrieveIdCardInformation.id:
      return state.merge({
        loaded: false,
        showErrors: false
      })

    case actions.retrieveIdCardInformation.id_fail:
      return state.merge({
        loaded: true,
        showErrors: true
      })

    case actions.retrieveIdCardInformation.id_success:
      return mapBackendToState(state, action)

    case actions.setFocusedField.id:
      return state.merge({
        focusedField: action.field,
        focusedGroup: action.group
      })

    case actions.changePhysicalAddressField.id:
      return setPhysicalAddressField(state, action)

    case actions.validate.id:
      return checkForNonValidFields(state)

    default:
      return state
  }
}
