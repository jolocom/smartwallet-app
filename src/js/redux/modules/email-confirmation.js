import Immutable from 'immutable'
import { makeActions } from './'

export const actions = module.exports = makeActions('email-confirmation', {
  confirm: {
    expectedParams: ['code'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {backend}) => {
        if (params === undefined) {
          let action = {
            type: actions.confirm.id_fail
          }
          return dispatch(action)
        }
        dispatch(actions.confirm
        .buildAction(params, (backend) => {
          return backend.wallet.confirmEmail(params)
        }))
      }
    }
  }
})
const confirmSuccess = (state) => Immutable.fromJS(state).merge({
  success: true,
  loading: false
})
const confirmFail = (state) => Immutable.fromJS(state).merge({
  loading: false
})
const initialState = Immutable.fromJS({
  success: false,
  loading: true
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.confirm.id_success:
      return confirmSuccess(state)
    case actions.confirm.id_fail:
      return confirmFail(state)
    default:
      return state
  }
}
