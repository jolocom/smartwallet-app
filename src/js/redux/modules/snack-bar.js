import { Map } from 'immutable'
import { action } from './'

export var showMessage = action('snack-bar', 'showMessage', {
  expectedParams: ['message'],
  creator: params => {
    const action = showMessage.buildAction(params)
    return dispatch => {
      action.id = setTimeout(() => {
        dispatch(closeShownMessage({id: action.id}))
      }, 4000)
      dispatch(action)
    }
  }
})
export var closeShownMessage = action('snack-bar', 'closeShownMessage', {
  expectedParams: ['id']
})
export var showMessageUndo = action('snack-bar', 'showMessageUndo', {
  expectedParams: ['message', 'callback'],
  creator: params => {
    return showMessage({
      message: params.message,
      undoCallback: params.undoCallback
    })
  }
})

const initialState = new Map({
  open: false,
  message: '',
  undo: false,
  undoCallback: null,
  id: null
})

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case showMessage.id:
      return state.merge({
        open: true, message: action.message,
        undo: !!action.undoCallback, id: action.id,
        undoCallback: action.undoCallback || null
      })
    case closeShownMessage.id:
      // Don't do anything if trying to close an old message
      return action.id === state.id ? initialState : state
    default:
      return state
  }
}
