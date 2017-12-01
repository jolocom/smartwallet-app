import Immutable from 'immutable'
import { makeActions } from './'

export const actions = makeActions('left-nav', {
  doLogout: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, {services, backend}) => {
        console.log(actions, params, 'here is your user3!')
        dispatch(actions.doLogout.buildAction(params, (backend) => {
          return console.log('here is your user2!')
          //return a gateway agent function call sending a HEAD request to {baseuri}/proxy/ to see if they are authenticated
          //.then
          // return backend.gateway.logout()
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
  open: false
})

export default (state = initialState, action = {}) => {
  switch (action.type) {
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
