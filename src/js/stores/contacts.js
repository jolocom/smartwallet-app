import Reflux from 'reflux'
import ContactsActions from 'actions/contacts'

import {contacts} from 'lib/fixtures'

export default Reflux.createStore({
  listenables: ContactsActions,
  getInitialState() {
    return contacts
  }
})
