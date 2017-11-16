import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'

const actions = module.exports = makeActions('wallet/webCam', {
  cancel: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        getState().toJS().wallet.webCam
          .onCancel(dispatch, getState, {services, backend})
        dispatch(actions.cancel.buildAction(params))
      }
    }
  },
  initiatePhotoScreen: {
    expectedParams: ['initiate', 'onSave', 'onCancel'],
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        params.initiate(dispatch, getState, {services, backend})
        dispatch(actions.initiatePhotoScreen.buildAction(params))
        dispatch(router.pushRoute('/wallet/identity/id-card-photo'))
      }
    }
  },
  save: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        getState().toJS().wallet.webCam
          .onSave(dispatch, getState, {services, backend})
        dispatch(actions.save.buildAction(params))
      }
    }
  },
  setNumberOfPhotos: {
    expectedParams: ['value']
  },
  addPhoto: {
    expectedParams: ['value', 'index'],
    creator: (...params) => {
      return (dispatch, getState) => {
        const {numberOfPhotos, photos} = getState().toJS().wallet.webCam
        if (photos.length < numberOfPhotos) {
          dispatch(actions.addPhoto.buildAction(...params))
        }
      }
    }
  },
  deletePhoto: {
    expectedParams: ['index']
  }
})

const initialState = module.exports.initialState = Immutable.fromJS({
  numberOfPhotos: 1,
  photos: [],
  onSave: () => {},
  onCancel: () => {}
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.addPhoto.id:
      return state.mergeIn(['photos', action.index], {
        value: action.value
      })

    case actions.cancel.id:
      return initialState

    case actions.deletePhoto.id:
      let newState = state.toJS()
      newState.photos.splice(action.index, 1)
      return Immutable.fromJS(newState)

    case actions.initiatePhotoScreen.id:
      return state.merge({
        onSave: action.onSave,
        onCancel: action.onCancel
      })

    case actions.save.id:
      return initialState

    case actions.setNumberOfPhotos.id:
      return state.merge({
        numberOfPhotos: action.value
      })
    default:
      return state
  }
}
