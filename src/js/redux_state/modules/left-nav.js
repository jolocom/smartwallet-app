import Immutable from 'immutable'
import { makeActions } from './'

export const actions = makeActions('left-nav', {
  doLogout: {
    expectedParams: [],
    async: true,
    creator: params => {
      return (dispatch, getState, {backend, services}) => {
        dispatch(actions.doLogout.buildAction(params, async () => {
          return backend.gateway.logout(services.auth.currentUser.wallet.userName)
        }))
      }
    }
  },

  showLeftNav: {
    expectedParams: []
  },

  hideLeftNav: {
    expectedParams: []
  },

  selectItem: {
    expectedParams: ['value']
  }
})

const initialState = Immutable.fromJS({
  selected: '/wallet',
  open: false,
  loggedIn: true
})

export default (state = initialState, action = {}) => {
  switch (action.type) {

    case actions.doLogout.id:
      return state.merge({loggedIn: false})

    case actions.showLeftNav.id:
      return state.merge({open: true})

    case actions.hideLeftNav.id:
      return state.merge({open: false})

    case actions.selectItem.id:
      return state.merge({selected: action.value})

    default:
      return state
  }
}
