import { Map } from 'immutable'
import { action } from './'

export const confirm = action('confirmation-dialog', 'confirm', {
  expectedParams: ['message', 'primaryActionText', 'callback', 'cancelActionText']
})
export const openConfirmDialog = confirm
export const close = action('confirmation-dialog', 'close', {
  expectedParams: []
})
export const closeConfirmDialog = close

const initialState = new Map({
  open: false,
  message: '',
  primaryActionText: 'Confirm',
  callback: null, // stores a global callback when OK is pressed
  cancelActionText: ''
})

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case confirm.id:
      return state.merge({open: true, ...confirm.getParams(action)})
    case close.id:
      return state.set('open', false)
    default:
      return state
  }
}
