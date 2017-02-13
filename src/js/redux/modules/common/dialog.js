import { Map } from 'immutable'
import { action } from '../'

export const show = action('confirmation-dialog', 'show', {
  expectedParams: ['id']
})
export const showDialog = show
export const hide = action('confirmation-dialog', 'hide', {
  expectedParams: ['id']
})
export const hideDialog = hide
export const toggle = action('confirmation-dialog', 'toggle', {
  expectedParams: ['id']
})
export const toggleDialog = hide

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
