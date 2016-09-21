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
      message: ''
    }
  },

  onShowMessage(message) {
    this.trigger({open: true, message: message},true)
    clearTimeout(this.hideTimeout)
    this.hideTimeout = setTimeout(() => {
      this.trigger({open: false, message: ''},true)
    }, 4000)
  }
})
