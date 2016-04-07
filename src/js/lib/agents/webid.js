import LDPAgent from './ldp.js'
import {Writer} from '../rdf.js'
import rdf from 'rdflib'
import N3 from 'n3'
import {dev} from '../../settings'
import Solid from 'solid-client'

let RDF = rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
let FOAF = rdf.Namespace('http://xmlns.com/foaf/0.1/')
let DC = rdf.Namespace('http://purl.org/dc/terms/')
let SIOC = rdf.Namespace('http://rdfs.org/sioc/ns#')

let N3Util = N3.Util
let solid = Solid
import {endpoint} from 'settings'

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

    writer.addTriple('', DC('title'), N3Util.createLiteral(`Inbox of ${username}`))
    writer.addTriple('', FOAF('maker'), webid)
    writer.addTriple('', FOAF('primaryTopic'), '#ingox')
    writer.addTriple('#inbox', RDF('type'), SIOC('Space'))

    return writer.end()
  }

// Converts the input from the forms to RDF data to put into the "card" card
  _profileTriples(username, name, email) {
    if (!username) { return Promise.reject('Must provide a username!') }
    let writer = new Writer()

    if (name)
      writer.addTriple('',DC('title'), N3Util.createLiteral(`WebID profile of ${name}`))
    else
      writer.addTriple('', DC('title'), N3Util.createLiteral(`WebID profile of ${username}`))

    writer.addTriple('', RDF('type') ,FOAF('PersonalProfileDocument'))
    writer.addTriple('', RDF('maker') ,'#me')
    writer.addTriple('', FOAF('primaryTopic'), '#me')

    writer.addTriple('#me', RDF('type'), FOAF('Person'))
    if (email) writer.addTriple('#me', FOAF('mbox'), email)
    writer.addTriple('#me', RDF('type'), FOAF('Person'))
    writer.addTriple('#me', RDF('type'), FOAF('Person'))
    if (name) writer.addTriple('#me', FOAF('name'), N3Util.createLiteral(name))

    return writer.end()
  }
}

export default WebIDAgent
