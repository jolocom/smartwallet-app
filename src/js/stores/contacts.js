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

        return Promise.all(res.map((node) => {
          return this.gAgent.fetchTriplesAtUri(node.uri).then((triples) => Object.assign({},triples,{uri: node.uri}))
        }))
      }).then((nodes) => {
        let contacts = nodes.filter((node) =>
          node.triples.some((triple) => {
            if (triple.predicate.uri == PRED.type.uri)
              return triple.predicate.uri == PRED.type.uri && triple.object.uri == PRED.Person.uri
          }))

        let formattedContacts = contacts.map((contact) => {

          let nameTriples = contact.triples.filter((triple) => triple.predicate.uri == PRED.givenName.uri)
          let emailTriples = contact.triples.filter((triple) => triple.predicate.uri == PRED.email.uri)
          let avatarTriples = contact.triples.filter((triple) => triple.predicate.uri == PRED.image.uri)
          

          return {
            name: nameTriples && nameTriples[0].object.value,
            username: nameTriples && nameTriples[0].object.value,
            webId: contact.uri || '????',
            email: emailTriples && emailTriples[0].object.value,
            imgUri: avatarTriples && avatarTriples[0] && avatarTriples[0].object.value
          }
        });
        
        this.trigger(formattedContacts); return;
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