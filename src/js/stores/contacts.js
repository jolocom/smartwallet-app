import Reflux from 'reflux'
import _ from 'lodash'
import ContactsActions from 'actions/contacts'
import AccountStore from 'stores/account'
import {
  PRED
} from 'lib/namespaces'
import GraphAgent from 'lib/agents/graph'

export default Reflux.createStore({
  listenables: ContactsActions,

  items: [],

  getInitialState() {
    return {
      loading: true,
      items: []
    }
  },

  onLoad(query) {
    if (!query || query === '') {
      if (!this.gAgent) {
        this.gAgent = new GraphAgent()
      }

      this.gAgent.findObjectsByTerm(
        AccountStore.state.webId, PRED.knows).then((res) => {
          return Promise.all(res.map((node) => {
            return this.gAgent.fetchTriplesAtUri(node.uri)
              .then((triples) => Object.assign(
                {},
                triples,
                {uri: node.uri}))
          }))
        }).then((nodes) => {
          let contacts = nodes.filter((node) =>
            node.triples.some((triple) => {
              if (triple.predicate.uri === PRED.type.uri) {
                return triple.predicate.uri ===
                  PRED.type.uri && triple.object.uri === PRED.Person.uri
              }
            }))

          let formattedContacts = contacts.map((contact) => {
            let nameTriples = contact.triples.filter((triple) =>
            triple.predicate.uri === PRED.givenName.uri)
            let emailTriples = contact.triples.filter((triple) =>
            triple.predicate.uri === PRED.email.uri)
            let avatarTriples = contact.triples.filter((triple) =>
            triple.predicate.uri === PRED.image.uri)
            return {
              name: nameTriples.length && nameTriples[0].object.value,
              username: nameTriples.length && nameTriples[0].object.value,
              webId: contact.uri || '????',
              email: emailTriples.length && emailTriples[0].object.value,
              imgUri: avatarTriples.length && avatarTriples[0] &&
              avatarTriples[0].object.value
            }
          })

          this.items = formattedContacts

          this.trigger({
            loading: false,
            items: this.items
          })
        })
    } else {
      let regEx = new RegExp(`.*${query}.*`, 'i')

      let results = _.filter(this.items, (contact) => {
        return contact.name.match(regEx)
      })

      this.trigger({
        loading: false,
        items: results
      })
    }
  }
})
