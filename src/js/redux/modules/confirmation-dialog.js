import { Map } from 'immutable'
import { action } from './'

export var confirm = action('confirmation-dialog', 'confirm', {
  expectedParams: ['message', 'primaryActionText', 'callback']
})
export var close = action('confirmation-dialog', 'close', {
  expectedParams: []
})

const initialState = Map({
  open: false,
  message: '',
  primaryActionText: 'Confirm',
  callback: null // stores a global callback when OK is pressed
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
