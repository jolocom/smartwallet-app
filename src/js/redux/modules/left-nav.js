import { Map } from 'immutable'
import { action } from './'

export const showLeftNav = action('left-nav', 'showLeftNav', {
  expectedParams: []
})
export const hideLeftNav = action('left-nav', 'hideLeftNav', {
  expectedParams: []
})
export const selectItem = action('left-nav', 'select', {
  expectedParams: []
})

const initialState = new Map({
  selected: '',
  open: false
})

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case showLeftNav.id:
      return state.set('open', true)
    case hideLeftNav.id:
      return state.set('open', false)
    case selectItem.id:
      return state.set('selected', action.value)
    default:
      return state
  }
}
