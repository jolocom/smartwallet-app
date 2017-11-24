import Immutable from 'immutable'

import {
  listOfCountries as __LIST_OF_COUNTRIES__
} from '../../../lib/list-of-countries'
import {
  setPhysicalAddressField,
  checkForNonValidFields,
  storeIdCardDetailsInSolid,
  genderList,
  mapBackendToState,
  changeFieldValue
} from '../../../lib/id-card-util'

import { makeActions } from '../'
import router from '../router'

import * as idCardPhotoActions from './webcam'

export const actions = makeActions('wallet/id-card', {
  cancel: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch) => {
        dispatch(router.pushRoute('/wallet/identity'))
        dispatch(actions.clearState())
        dispatch(actions.cancel.buildAction(params))
      }
    }
  },
  changeIdCardField: {
    expectedParams: ['field', 'value']
  },
  changeIdCardPhoto: {
    expectedParams: ['field', 'value'],
    creator: (...params) => {
      return (dispatch) => {
        dispatch(actions.changeIdCardPhoto.buildAction(...params))
      }
    }
  },
  changePhysicalAddressField: {
    expectedParams: ['field', 'value']
  },
  clearState: {
    expectedParams: []
  },
  goToIdCardPhotoScreen: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(idCardPhotoActions.initiatePhotoScreen({
          initiate(dispatch, getState) {
            dispatch(idCardPhotoActions.setNumberOfPhotos(2))
            const { frontSideImg, backSideImg } = getState()
              .toJS().wallet.idCard.idCard.images
            let index = 0
            if (frontSideImg.value !== '') {
              dispatch(idCardPhotoActions.addPhoto(frontSideImg.value, index))
              index++
            }
            if (backSideImg.value !== '') {
              dispatch(idCardPhotoActions.addPhoto(backSideImg.value, index))
            }
          },
          onSave(dispatch, getState) {
            const [
              frontSideImg = {value: ''}, backSideImg = {value: ''}
            ] = getState().toJS().wallet.webCam.photos
            dispatch(
              actions.changeIdCardPhoto('frontSideImg', frontSideImg.value))
            dispatch(
              actions.changeIdCardPhoto('backSideImg', backSideImg.value))
            dispatch(router.pushRoute('/wallet/identity/id-card'))
          },
          onCancel(dispatch) {
            dispatch(router.pushRoute('/wallet/identity/id-card'))
          }
        }))

        dispatch(actions.goToIdCardPhotoScreen.buildAction(params))
        dispatch(router.pushRoute('/wallet/identity/id-card-photo'))
      }
    }
  },
  goToIdCardScreen: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.goToIdCardScreen.buildAction(params))
        dispatch(router.pushRoute('/wallet/identity/id-card'))
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
        ).then((result) => {
          dispatch(actions.clearState())
          dispatch(router.pushRoute('/wallet/identity'))
          return result
        })
        }
      }
    }
  },
  setFocusedField: {
    expectedParams: ['field', 'group']
  },
  setFoccusedGroup: {
    expectedParams: ['value']
  },
  setShowAddress: {
    expectedParams: ['value']
  },
  retrieveIdCardInformation: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.retrieveIdCardInformation.buildAction(params,
          () => backend.solid.getIdCardInformation()
        ))
      }
    }
  },
  validate: {
    expectedParams: []
  }
})

export const initialState = Immutable.fromJS({
  loaded: false,
  showErrors: false,
  focusedGroup: '',
  focusedField: '',
  idCard: {
    images: {
      frontSideImg: {value: ''},
      backSideImg: {value: ''}
    },
    locations: [{title: '', streetWithNumber: '', zip: '', city: ''}],
    number: {value: '', valid: false},
    expirationDate: {value: '', valid: false},
    firstName: {value: '', valid: false},
    lastName: {value: '', valid: false},
    gender: {value: '', valid: false, options: genderList},
    birthDate: {value: '', valid: false},
    birthPlace: {value: '', valid: false},
    birthCountry: {value: '', valid: false, options: __LIST_OF_COUNTRIES__},
    showAddress: false,
    physicalAddress: {
      streetWithNumber: {value: '', valid: false},
      zip: {value: '', valid: false},
      city: {value: '', valid: false},
      state: {value: '', valid: false},
      country: {value: '', valid: false, options: __LIST_OF_COUNTRIES__}
    }
  }
})

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.changeIdCardField.id:
      return changeFieldValue(state, action)

    case actions.changePhysicalAddressField.id:
      return setPhysicalAddressField(state, action)

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

    case actions.save.id_success:
      return state.merge({
        loaded: true,
        showErrors: false
      })

    case actions.setShowAddress.id:
      return state.mergeIn(['idCard'], {
        showAddress: action.value
      })

    case actions.setFocusedField.id:
      return state.merge({
        focusedField: action.field,
        focusedGroup: action.group
      })

    case actions.changeIdCardPhoto.id:
      return state.mergeIn(['idCard', 'images', action.field], {
        value: action.value
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

    case actions.validate.id:
      return checkForNonValidFields(state)

    default:
      return state
  }
}
