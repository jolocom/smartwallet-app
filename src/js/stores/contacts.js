import Reflux from 'reflux'
import _ from 'lodash'
import ContactsActions from 'actions/contacts'
import AccountStore from 'stores/account'
import {
  PRED
}
from 'lib/namespaces'
import GraphAgent from 'lib/agents/graph'

import {contacts} from 'lib/fixtures'

export default Reflux.createStore({
  listenables: ContactsActions,
  getInitialState() {
    return []
  },
  onLoad(query) {
    if (!query || query === '') {


      if (!this.gAgent) {
        this.gAgent = new GraphAgent()
      }

      this.gAgent.findObjectsByTerm(AccountStore.state.webId, PRED.knows).then((res) => {
        console.log('res', res);

        return Promise.all(res.map((node) => {
          console.log('node.uri', node.uri)
          return this.gAgent.fetchTriplesAtUri(node.uri).then((triples) => Object.assign({},triples,{uri: node.uri}))
        }))
      }).then((nodes) => {
        console.log('nodes', nodes)

        console.table(contacts)
        

        let contacts = nodes.filter((node) =>
          node.triples.some((triple) => {
            if (triple.predicate.uri == PRED.type.uri)
              return triple.predicate.uri == PRED.type.uri && triple.object.uri == PRED.Person.uri
          }))

        console.log('contacts', contacts)

        let formattedContacts = contacts.map((contact) => {

          let nameTriples = contact.triples.filter((triple) => triple.predicate.uri == PRED.givenName.uri)
          let emailTriples = contact.triples.filter((triple) => triple.predicate.uri == PRED.email.uri)
          let avatarTriples = contact.triples.filter((triple) => triple.predicate.uri == PRED.image.uri)
          
          console.log('this contact', contact)

          return {
            name: nameTriples && nameTriples[0].object.value,
            username: nameTriples && nameTriples[0].object.value,
            webId: contact.uri || '???',
            email: emailTriples && emailTriples[0].object.value,
            imgUri: avatarTriples && avatarTriples[0] && avatarTriples[0].object.value
          }
        });

        console.log('formatted contacts', JSON.stringify(formattedContacts))
        console.log('formatted contacts objet assign', Object.assign({}, formattedContacts))
        
    this.trigger(formattedContacts); return;
        /*
        this.trigger(Object.assign({}, formattedContacts), true, true)
        this.state = formattedContacts */
      })

    } else {
      alert('WIP')
      let regEx = new RegExp(`.*${query}.*`, 'i')

      let results = _.filter(contacts, (contact) => {
        return contact.name.match(regEx)
      })

      this.trigger(results)
    }
  }
})