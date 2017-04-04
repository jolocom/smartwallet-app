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
  }
})

const initialState = Immutable.fromJS({
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.getAccountInformation.id_success:
      let initialState = {
        originalInformation: action.result,
        information: action.result
      }
      // let prop
      // console.log(action.result)
      for (let prop in initialState.information) {
        for (let i = 0; i < initialState.information[prop].length; i++) {
          initialState.information[prop][i].delete = false
          initialState.information[prop][i].update = false
        }
      }
      // console.log(Immutable.fromJS(action.result).toJS())
      return Immutable.fromJS(initialState)
      // console.log(action.result)
    case actions.setInformation.id:
      console.log(action)
      let update = state.getIn(['originalInformation',
        action.field, action.index, 'address']) !== action.value
      state = state.setIn(['information',
        action.field, action.index, 'address'], action.value)
      return state.setIn(['information',
        action.field, action.index, 'update'], update)
    default:
      return state
  }
}
