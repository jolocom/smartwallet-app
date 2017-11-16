import { Map } from 'immutable'
import { action } from './'

export const showLeftNav = action('left-nav', 'showLeftNav', {
  expectedParams: []
})
export const hideLeftNav = action('left-nav', 'hideLeftNav', {
  expectedParams: []
})
export const selectItem = action('left-nav', 'selectItem', {
  expectedParams: ['value']
})

const initialState = new Map({
  selected: '/wallet',
  open: false
})

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case showLeftNav.id:
      return state.merge({open: true})

    case hideLeftNav.id:
      return state.merge({open: false})

    case selectItem.id:
      return state.merge({selected: action.value})

    default:
      return state
  }
}
