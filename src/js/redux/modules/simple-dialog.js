import { Map } from 'immutable'
import { action } from './'
import toggleable from './generic/toggleable'

const simpleDialogVisibility = toggleable('simple-dialog', 'simpleDialog', {
  initialValue: false
})
export const {toggle: toggleSimpleDialog, show: showSimpleDialog,
hide: hideSimpleDialog } = simpleDialogVisibility.actions

export const configSimpleDialogMessage = action(
  'simple-dialog', 'configSimpleDialogMessage', {
    expectedParams: ['message', 'primaryActionText', 'style']
  })

export const configSimpleDialog = configSimpleDialogMessage
const initialState = new Map({
  visible: false,
  message: '',
  primaryActionText: 'OK',
  style: {}
})

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case toggleSimpleDialog.id:
    case hideSimpleDialog.id:
    case showSimpleDialog.id:
      return state.set('visible',
        simpleDialogVisibility.reducer(state.visible, action)
      )
    case configSimpleDialog.id:
      return state.merge(configSimpleDialog.getParams(action))
    default:
      return state
  }
}
