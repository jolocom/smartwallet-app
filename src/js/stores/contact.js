import Reflux from 'reflux'
import ContactActions from 'actions/contact'
import _ from 'lodash'

import {contacts} from 'lib/fixtures'

export default Reflux.createStore({
  listenables: ContactActions,
  getInitialState() {
    return {
      loading: true
    }
  },
  onLoad(username) {
    this.trigger(_.extend({
      loading: false
    }, _.findWhere(contacts, {username: username})))
  }
})
