import Reflux from 'reflux'
import _ from 'lodash'
import ContactsActions from 'actions/contacts'

import {contacts} from 'lib/fixtures'

export default Reflux.createStore({
  listenables: ContactsActions,
  getInitialState() {
    return []
  },
  onLoad(filterBy) {
    if (!filterBy || filterBy === '') {
      this.trigger(contacts)
      return
    }

    let regEx = new RegExp(`.*${filterBy}.*`, 'i')

    let results = _.filter(contacts, (contact) => {
      return contact.name.match(regEx)
    })

    this.trigger(results)
  }
})
