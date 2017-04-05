// import * as _ from 'lodash'
import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'

const actions = module.exports = makeActions('wallet/contact', {
  saveChanges: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(router.pushRoute('/wallet/identity'))
        // dispatch(router.pushRoute('/wallet/identity/contact'))
      }
    }
  },
  exitWithoutSaving: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(router.pushRoute('/wallet/identity'))
      }
    }
  },
  getAccountInformation: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.getAccountInformation
        .buildAction(params, (backend) => {
          return backend.wallet.getAccountInformation()
        }))
      }
    }
  },
  setInformation: {
    expectedParams: ['field', 'index', 'value']
  },
  deleteInformation: {
    expectedParams: ['field', 'index']
  }
})

const initialState = Immutable.fromJS({
  newInformation: {
    emails: []
  }
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.getAccountInformation.id_success:
      let initialState = {
        originalInformation: action.result
      }
      // let prop
      // console.log(action.result)
      for (let prop in initialState.originalInformation) {
        for (let i = 0; i < initialState.originalInformation[prop].length; i++) { // eslint-disable-line max-len
          initialState.originalInformation[prop][i].delete = false
          // initialState.originalInformation[prop][i].update = false
        }
      }
      // console.log(Immutable.fromJS(action.result).toJS())
      return state.merge(Immutable.fromJS(initialState))

    case actions.setInformation.id:
      return state.setIn(['newInformation',
        action.field, action.index], action.value)

    case actions.deleteInformation.id:
      return state.setIn(['originalInformation',
        action.field, action.index, 'delete'], true)
    default:
      return state
  }
}
