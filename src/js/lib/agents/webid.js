import HTTPAgent from './http.js'
import {Writer} from '../rdf.js'
import {DC, FOAF, RDF} from '../namespaces.js'
import N3 from 'n3'
import {dev} from '../../settings'

let N3Util = N3.Util

// WebID related functions
class WebIDAgent extends HTTPAgent {

  // Will check whether a resource exists on the origin server. 
  // If it does- we say that profile is taken.
  isFakeIDAvailable(username) {
    return this.head(`${document.location.origin}/${username}`)
      .then(() => {
        return false
      }).catch(() => {
        return true
      })
  }

  _formatFakeWebID(username) {
    return `${document.location.origin}/${username}/profile/card#me`
  }

  // get WebID depending on the mode
  getWebID() {
    let getWebID = null
    if (dev) {
      getWebID = Promise.resolve(this._formatFakeWebID(localStorage.getItem('fake-user')))
    } else {
      getWebID = this.head(document.location.origin)
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

    let userContainer = `${document.location.origin}/${username}`
    let userProfileContainer = `${document.location.origin}/${username}/profile`
    let profileDoc = `${document.location.origin}/${username}/profile/card`

    let headers = {
      'Content-Type': 'text/turtle',
      'Link': '<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"'
    }

    console.log('creating fake profile...')
    console.log(username)
    console.log(name)
    console.log(email)

    let p = this.put(userContainer, headers)
      .then(() => {
        return this.put(userProfileContainer, headers)
      })
      .then(() => {
        return this._profileTriples(username, name, email)
      })
      .then((turtleText) => {
        return this.put(profileDoc, {'Content-type': 'text/turtle'}, turtleText)
      })

    console.log('done.')
    return p
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
