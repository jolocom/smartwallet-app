import Immutable from 'immutable'
import { makeActions } from './'

export const actions = module.exports = makeActions('email-confirmation', {
  confirm: {
    expectedParams: ['code'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {backend}) => {
        if(params === undefined){
          return confirmFail(getState())
        }
        dispatch(actions.setCode.buildAction(params.code))
        dispatch(actions.confirm
        .buildAction(params, (backend) => {
          return backend.wallet.confirmEmail(params)
        }))
      }
    }
  },
  setCode: {
    expectedParams: ['code']
  }
})
const confirmSuccess = (state) => Immutable.fromJS(state).merge({
  success: true
})
const confirmFail = (state) => Immutable.fromJS(state).merge({
  success: false
})
const initialState = Immutable.fromJS({
  success: false,
  code: ''
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.setCode.id:
      return state.merge({
        code: action.code
      })
    case actions.confirm.id_success:
      return confirmSuccess(state)
    case actions.confirm.id_fail:
      return confirmFail(state)
    default:
      return state
  }
}
