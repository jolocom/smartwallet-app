import Reflux from 'reflux'
import PrivacyActions from 'actions/privacy-settings'

export default Reflux.createStore({
  listenables: PrivacyActions,
  init() {

  },

  getInitialState() {

  },

  fetchInitialData() {
    // TODO
  },

  allowView(user) {

  }
})
