import LDPAgent from './ldp.js'
import {Writer} from '../rdf.js'
import {DC, FOAF, RDF, SIOC} from '../namespaces.js'
import N3 from 'n3'
import {dev} from '../../settings'

let N3Util = N3.Util

let origin = 'https://localhost:8443'

// WebID related functions
class WebIDAgent extends LDPAgent {

  // Will check whether a resource exists on the origin server.
  // If it does- we say that profile is taken.
  isFakeIDAvailable(username) {
    return this.head(`${origin}/${username}`)
      .then(() => {
        return false
      }).catch(() => {
        return true
      })
  }

  _formatFakeWebID(username) {
    return `${origin}/${username}/profile/card#me`
  }

  // get WebID depending on the mode
  getWebID() {
    let getWebID = null
    if (dev) {
      getWebID = Promise.resolve(this._formatFakeWebID(localStorage.getItem('fake-user')))
    } else {
      getWebID = this.head(origin)
        .then((xhr) => {
          return xhr.getResponseHeader('User')
        })
    }
    return getWebID
  }

  fakeSignup(username, name, email) {
    // create container $username
    // create container $username/profile
    // create resource $username/profile/card
    // create container $username/little-sister
    // create container $username/little-sister/graph-comments
    // create resource $username/little-sister/inbox
    // create container $username/little-sister/graph-nodes

    let userContainer = `${origin}/${username}`
    let userProfileContainer = `${origin}/${username}/profile`
    let profileDoc = `${origin}/${username}/profile/card`
    let appContainer = `${origin}/${username}/little-sister`
    let inboxDoc = `${origin}/${username}/little-sister/inbox`
    let commentsContainer = `${origin}/${username}/little-sister/graph-comments`
    let nodesContainer = `${origin}/${username}/little-sister/graph-nodes`

    console.log('creating fake profile...')
    console.log(username)
    console.log(name)
    console.log(email)

    let p = this.createBasicContainer(userContainer)
      .then(() => {
        return Promise.all([this.createBasicContainer(userProfileContainer), this.createBasicContainer(appContainer)])
      })
      .then(() => {
        return Promise.all([this.createBasicContainer(commentsContainer), this.createBasicContainer(nodesContainer)])
      })
      .then(() => {
        return Promise.all([this._profileTriples(username, name, email), this._inboxTriples(username)])
      })
      .then((results) => {
        let profileText = results[0]
        let inboxText = results[1]
        let hdrs = {'Content-type': 'text/turtle'}
        return Promise.all([this.put(profileDoc, hdrs, profileText), this.put(inboxDoc, hdrs, inboxText)])
      })

    console.log('done.')
    return p
  }

  _inboxTriples(username) {
    if (!username) {
      return Promise.reject('Must provide a username!')
    }

    let webid = `https://localhost:8443/${username}/profile/card#me`

    let writer = new Writer()

    let triples = [
        {
          subject: '',
          predicate: DC.title,
          object: N3Util.createLiteral(`Inbox of ${username}`)
        },
        {
          subject: '',
          predicate: FOAF.maker,
          object: webid
        },
        {
          subject: '',
          predicate: FOAF.primaryTopic,
          object: '#inbox'
        },
        {
          subject: '#inbox',
          predicate: RDF.type,
          object: SIOC.Space
        }
    ]

    for (var t of triples) {
      writer.addTriple(t)
    }

    return writer.end()
  }

  _profileTriples(username, name, email) {
    if (!username) {
      return Promise.reject('Must provide a username!')
    }

    let writer = new Writer()
    let docTitle = null
    if (name) {
      docTitle = {
        subject: '',
        predicate: DC.title,
        object: N3Util.createLiteral(`WebID profile of ${name}`)
      }
    } else {
      docTitle = {
        subject: '',
        predicate: DC.title,
        object: N3Util.createLiteral(`WebID profile of ${username}`)
      }
    }

    // about profile doc
    let aboutProfileDoc = [
      docTitle,
        {
          subject: '',
          predicate: RDF.type,
          object: FOAF.PersonalProfileDocument
        },
        {
          subject: '',
          predicate: FOAF.maker,
          object: '#me'
        },
        {
          subject: '',
          predicate: FOAF.primaryTopic,
          object: '#me'
        }
    ]
    for (var t of aboutProfileDoc) {
      writer.addTriple(t)
    }

    let aboutPerson = [
        {
          subject: '#me',
          predicate: RDF.type,
          object: FOAF.Person
        }
    ]

    if (email) {
      aboutPerson.push({
        subject: '#me',
        predicate: FOAF.mbox,
        object: email
      })
    }

    if (name) {
      aboutPerson.push({
        subject: '#me',
        predicate: FOAF.name,
        object: N3Util.createLiteral(name)
      })
    }

    for (t of aboutPerson) {
      writer.addTriple(t)
    }

    return writer.end()
  }
}

export default WebIDAgent
