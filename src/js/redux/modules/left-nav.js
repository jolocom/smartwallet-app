import { Map } from 'immutable'
import { action } from './'

export const showLeftNav = action('left-nav', 'showLeftNav', {
  expectedParams: []
})
export const hideLeftNav = action('left-nav', 'hideLeftNav', {
  expectedParams: []
})

const initialState = new Map({
  selected: 'graph',
  open: false
})

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case showLeftNav.id:
      return state.set('open', true)
    case hideLeftNav.id:
      return state.set('open', false)
    default:
      return state
  }
}
