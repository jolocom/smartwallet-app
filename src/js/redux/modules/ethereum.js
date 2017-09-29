import Immutable from 'immutable'
import { makeActions } from './'

export const actions = module.exports = makeActions('ethereum', {
  executeTransaction: {
    expectedParams: [
      'requester', 'contractID', 'method', 'params', 'value', 'returnURL'
    ],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {backend, services}) => {
        // const { id, pin } = getState().toJS().wallet.identity
        //     .contact.emails[params.index]

        dispatch(actions.executeTransaction.buildAction(params, () => {
          return backend.gateway.executeEthereumTransaction({
            userName: services.auth.currentUser.wallet.userName,
            seedPhrase: services.auth.currentUser.wallet.seedPhrase,
            ...params
          }).then(() => { window.location.href = params.returnURL })
        }))
      }
    }
  }
})

const initialState = Immutable.fromJS({
  success: false,
  loading: true
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    // case actions.confirmEmail.id_success:
    //   return confirmSuccess(state)
    default:
      return state
  }
}
