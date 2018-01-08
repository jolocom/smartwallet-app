import { Map } from 'immutable'
import { makeActions } from './'

export const actions = makeActions('confirmation-dialog', {
  openConfirmDialog: {
    expectedParams: [
      'title',
      'message',
      'primaryActionText',
      'callback',
      'cancelActionText',
      'style'
    ]
  },
  closeConfirmDialog: { expectedParams: [] }
})

const initialState = new Map({
  open: false,
  message: '',
  primaryActionText: 'Confirm',
  callback: null, // stores a global callback when OK is pressed
  cancelActionText: '',
  style: {}
})

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case actions.openConfirmDialog.id:
      const params = actions.openConfirmDialog.getParams(action)
      return state.merge({open: true, ...params})
    case actions.closeConfirmDialog.id:
      return state.set('open', false)
    default:
      return state
  }
}
