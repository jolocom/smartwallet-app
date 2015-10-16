import Reflux from 'reflux'
import ContactsActions from 'actions/contacts'

export default Reflux.createStore({
  listenables: ContactsActions,
  getInitialState() {
    return [{
      name: 'Eelco Wiersma',
      email: 'hi@eelcowiersma.nl'
    }, {
      name: 'Joachim Lohkamp',
      email: 'joachim@jolocom.com'
    }, {
      name: 'Justas Azna',
      email: 'justas@jolocom.com'
    }, {
      name: 'Christian Hildebrand',
      email: 'christian@jolocom.com'
    }, {
      name: 'Anna Blume',
      email: 'anna@jolocom.com'
    }]
  }
})
