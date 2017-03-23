import Reflux from 'reflux'
import Snackbar from 'actions/snackbar'

export default Reflux.createStore({
  listenables: Snackbar,
  init() {
    this.hideTimeout = -1
  },

  getInitialState() {
    return {
      open: false,
      message: '',
      undo: false
    }
  },

  onShowMessage(message) {
    this.trigger({open: true, message: message, undo: false}, true)
    clearTimeout(this.hideTimeout)
    this.hideTimeout = setTimeout(() => {
      this.trigger({open: false, message: '', undo: false}, true)
    }, 4000)
  },

  onShowMessageUndo(message, undoCallback) {
    this.trigger({
      open: true,
      message: message,
      undo: true,
      undoCallback: undoCallback
  }, true)
    clearTimeout(this.hideTimeout)
    this.hideTimeout = setTimeout(() => {
      this.trigger({open: false, message: '', undo: true}, true)
    }, 4000)
  }
})
