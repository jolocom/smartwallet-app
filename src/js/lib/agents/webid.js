import LDPAgent from './ldp.js'
import {Writer} from '../rdf.js'
import rdf from 'rdflib'
import {dev} from 'settings'
import Solid from 'solid-client'
import {endpoint} from 'settings'

let RDF = rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
let FOAF = rdf.Namespace('http://xmlns.com/foaf/0.1/')
let DC = rdf.Namespace('http://purl.org/dc/terms/')
let SIOC = rdf.Namespace('http://rdfs.org/sioc/ns#')
let solid = Solid

// WebID related functions
class WebIDAgent extends LDPAgent {

  // Will check whether a resource exists on the origin server.
  // If it does- we say that profile is taken.
  isFakeIDAvailable(username) {
    return this.head(`${endpoint}/${username}`)
      .then(() => {
        return false
      }).catch(() => {
        return true
      })
  }

  _formatFakeWebID(username) {
    return `${endpoint}/${username}/profile/card#me`
  }

  // get WebID depending on the mode
  getWebID() {
    let getWebID = null
    if (dev) {
      getWebID = Promise.resolve(this._formatFakeWebID(localStorage.getItem('fake-user')))
    } else {
      return getWebID = solid.currentUser()
    }
    return getWebID
  }

// Creates the user folders and writes the data to the card / inbox files

// TODO rework the container creation a bit according to the specs described in here
// http://github.com/solid/solid-spec/blob/master/api-rest.md

  fakeSignup(username, name, email) {

    solid.web.put(`${endpoint}/${username}/little-sister/graph-comments/`)
    solid.web.put(`${endpoint}/${username}/little-sister/graph-nodes/`)

    let p = Promise.all([this._profileTriples(username, name, email), this._inboxTriples(username)])
      .then((result)  => {
        solid.web.put(`${endpoint}/${username}/profile/card`, result[0])
        solid.web.put(`${endpoint}/${username}/little-sister/inbox`, result[1])
      })
    return p
  }

// Converts the input from the forms to RDF data to put into the inbox card
  _inboxTriples(username) {
    if (!username) { return Promise.reject('Must provide a username!')}

    let webid = `${endpoint}/${username}/profile/card#me`
    let writer = new Writer()

    // Please take a look at
    // https://github.com/solid/solid-spec/blob/master/solid-webid-profiles.md#profile-representation-formats
    // For extra info on the structure of a valid webId Profile
    writer.addTriple(rdf.sym(''), DC('title'), `Inbox of ${username}`)
    writer.addTriple(rdf.sym(''), FOAF('maker'), webid)
    writer.addTriple(rdf.sym(''), FOAF('primaryTopic'), rdf.sym('#inbox'))
    writer.addTriple(rdf.sym('#inbox'), RDF('type'), SIOC('Space'))
    return writer.end()
  }

// Converts the input from the forms to RDF data to put into the "card" card
  _profileTriples(username, name, email) {
    if (!username) { return Promise.reject('Must provide a username!') }
    let writer = new Writer()

    if (name) writer.addTriple(rdf.sym(''),DC('title'), `WebID profile of ${name}`)
    else writer.addTriple(rdf.sym(''), DC('title'), `WebID profile of ${username}`)

    writer.addTriple(rdf.sym(''), RDF('type') ,FOAF('PersonalProfileDocument'))
    writer.addTriple(rdf.sym(''), FOAF('maker') ,rdf.sym('#me'))
    writer.addTriple(rdf.sym(''), FOAF('primaryTopic'), rdf.sym('#me'))

    writer.addTriple(rdf.sym('#me'), RDF('type'), FOAF('Person'))
    if (email) writer.addTriple(rdf.sym('#me'), FOAF('mbox'), email)
    if (name) writer.addTriple(rdf.sym('#me'), FOAF('name'), name)
    return writer.end()
  }
}

export default WebIDAgent
