import { Map } from 'immutable'
import { action } from '../'

export var show = action('confirmation-dialog', 'show', {
  expectedParams: ['id']
})
export var hide = action('confirmation-dialog', 'hide', {
  expectedParams: ['id']
})
export var toggle = action('confirmation-dialog', 'toggle', {
  expectedParams: ['id']
})

const initialState = new Map({
})

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case show.id:
      return state.setIn([action.id, 'visible'], true)
    case hide.id:
      return state.setIn([action.id, 'visible'], false)
    case toggle.id:
      return state.updateIn([action.id, 'visible'], value => !value)
    default:
      return state
  }
}
