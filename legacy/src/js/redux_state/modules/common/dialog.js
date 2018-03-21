import { Map } from 'immutable'
import { syncAction } from '../'

export const show = syncAction('common/dialog', 'show', {
  expectedParams: ['id']
})
export const showDialog = show
export const hide = syncAction('common/dialog', 'hide', {
  expectedParams: ['id']
})
export const hideDialog = hide
export const toggle = syncAction('common/dialog', 'toggle', {
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
