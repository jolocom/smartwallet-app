import { Map } from 'immutable'
import { action } from './'

export const openSimple = action('simple-dialog', 'openSimple', {
  expectedParams: ['message', 'primaryActionText']
})
export const openSimpleDialog = openSimple
export const close = action('simple-dialog', 'close', {
  expectedParams: []
})
export const closeSimpleDialog = close

const initialState = new Map({
  open: false,
  message: '',
  primaryActionText: 'OK'
})

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case openSimple.id:
      return state.merge({open: true, ...openSimple.getParams(action)})
    case close.id:
      return state.set('open', false)
    default:
      return state
  }
}
