import Reflux from 'reflux'
import ContactActions from 'actions/contact'
import find from 'lodash/find'

import {contacts} from 'lib/fixtures'

export default Reflux.createStore({
  listenables: ContactActions,
  getInitialState() {
    return {
      loading: true
    }
  },
  onLoad(username) {
    this.trigger(Object.assign({
      loading: false
    }, find(contacts, {username: username})))
  }
})
