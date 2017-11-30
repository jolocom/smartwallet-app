import { Map } from 'immutable'
import { makeActions } from './'

export const actions = makeActions('left-nav', {
  doLogout: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch) => {
        localStorage.removeItem('jolocom.identity')
        dispatch(actions.doLogout.buildAction(params))
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

const initialState = new Map({
  selected: '/wallet',
  open: false
})

export default function reducer(state = initialState, action = {}) {
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
