import Reflux from 'reflux'
import Confirm from 'actions/confirm'

export default Reflux.createStore({
  listenables: Confirm,

  getInitialState() {
    return {
      open: false,
      message: '',
      primaryActionText: false,
      callback: null
    }
  },

  onConfirm(message,primaryActionText,callback) {
    this.trigger({open: true, message, primaryActionText, callback}, true)
  },

  onClose() {
    this.trigger(Object.assign({}, this.state, {open: false}), true)
  },
})
