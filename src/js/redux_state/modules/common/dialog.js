import { Map } from 'immutable'
import { action } from '../'

export const show = action('common/dialog', 'show', {
  expectedParams: ['id']
})
export const showDialog = show
export const hide = action('common/dialog', 'hide', {
  expectedParams: ['id']
})
export const hideDialog = hide
export const toggle = action('common/dialog', 'toggle', {
  expectedParams: ['id']
})
export const toggleDialog = toggle

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
