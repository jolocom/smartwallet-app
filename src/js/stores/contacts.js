import Reflux from 'reflux'
import ContactsActions from 'actions/contacts'
import {PRED} from 'lib/namespaces'
import GraphAgent from 'lib/agents/graph'
import WebIdAgent from 'lib/agents/webid'

export default Reflux.createStore({
  listenables: ContactsActions,

  items: [],

  getInitialState() {
    return {
      loading: true,
      items: []
    }
  },

  init() {
    this.gAgent = new GraphAgent()
    this.wia = new WebIdAgent()
    this.webId = this.wia.getWebId()
  },

  /*
  * @summary Loads the list of people you know from your profile.
  * @param {string} query - If provided, only strings matching
  *  the query be returned.
  * @return {array} items - List of objects structure
  *  {name,username,webid,email,imgUri} matching the query.
  */
  onLoad(query) {
    if (!query) {
      // Fetch a list of friends and their triples.
      return this.gAgent.findFriends(this.webId).then((res) => {
        res = res.map(el => el.object)
        return Promise.all(res.map((friend) => {
          return this.gAgent.fetchTriplesAtUri(friend.uri)
          .then(triples => {
            return {
              uri: friend.uri,
              triples: triples.triples
            }
          })
        }))
      }).then((nodes) => {
        // nodes = [{uri: node uri, triples:[]}]
        let contacts = nodes.filter((node) =>
          node.triples.some((triple) => {
            // Out of the contacts we are filtering out only the people
            // Presumably you would only "know" people anyways.
            if (triple.predicate.uri === PRED.type.uri) {
              return triple.object.uri === PRED.Person.uri
            }
          })
        )
        let formattedContacts = contacts.map((contact) => {
          let name, email, avatar
          contact.triples.forEach(t => {
            const pred = t.predicate.uri
            const obj = t.object.uri ? t.object.uri : t.object.value
            if (pred === PRED.givenName.uri || pred === PRED.fullName.uri) {
              name = obj
            } else if (pred === PRED.email.uri) {
              email = obj
            } else if (pred === PRED.image.uri) {
              avatar = obj
            }
          })
          return {
            name: name,
            username: name,
            webId: contact.uri || '????',
            email: email && email.replace('mailto:', ''),
            imgUri: avatar
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
      let results = this.items.filter(contact => {
        return contact.name.match(regEx)
      })

      this.trigger({
        loading: false,
        items: results
      })
    }
  }
})
