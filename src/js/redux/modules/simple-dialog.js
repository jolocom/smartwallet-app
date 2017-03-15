import { Map } from 'immutable'
import { action } from './'
import toggleable from './generic/toggleable'

const simpleDialogVisibility = toggleable('simple-dialog', 'simpleDialog', {
  initialValue: false
})
export const {toggle: toggleSimpleDialog, show: showSimpleDialog,
hide: hideSimpleDialog } = simpleDialogVisibility.actions

export const configSimpleDialogMessage = action('simple-dialog', 'configSimpleDialogMessage', {
  expectedParams: ['message', 'primaryActionText']
})
export const configSimpleDialog = configSimpleDialogMessage
const initialState = new Map({
  visible: false,
  message: '',
  primaryActionText: 'OK'
})

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case toggleSimpleDialog.id:
    case hideSimpleDialog.id:
    case showSimpleDialog.id:
      return state.merge(simpleDialogVisibility(state, action))
    case configSimpleDialog.id:
      console.log(configSimpleDialog.getParams(action))
      return state.merge(...configSimpleDialog.getParams(action))
    default:
      return state
  }
}
