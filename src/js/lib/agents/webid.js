import LDPAgent from './ldp.js'
import HTTPAgent from './http.js'
import {Parser} from '../rdf'
import {PRED} from '../namespaces.js'
import $rdf from 'rdflib'

// WebID related functions
class WebIDAgent {
  constructor() {
    this.ldp = new LDPAgent()
    this.http = new HTTPAgent({proxy: true})
  }

  // Gets the webId of the currently loged in user from local storage,
  getWebId() {
    const wallet = localStorage.getItem('jolocom.smartWallet')
    let webId
    try {
      webId = JSON.parse(wallet).webId
    } catch (e) {
      // TODO Handle
      console.error('No webId found')
    }
    return webId
  }

  updateProfile(newData, oldData) {
    let insertTriples = []
    let deleteTriples = []
    let toAdd = $rdf.graph()
    let toDel = $rdf.graph()

    let predicateMap = {
      familyName: PRED.familyName,
      givenName: PRED.givenName,
      fullName: PRED.fullName,
      imgUri: PRED.image,
      email: PRED.email,
      socialMedia: PRED.socialMedia,
      mobilePhone: PRED.mobile,
      address: PRED.address,
      profession: PRED.profession,
      company: PRED.company,
      url: PRED.url,
      creditCard: PRED.creditCard
    }

    for (let pred in predicateMap) {
      if (newData[pred] !== oldData[pred]) {
        if (!oldData[pred] || newData[pred]) {
          // inserting
          insertTriples.push({
            subject: $rdf.sym(oldData.webId),
            predicate: predicateMap[pred],
            object: newData[pred]
          })
        }
        if (!newData[pred] || oldData[pred]) {
          // delete
          deleteTriples.push({
            subject: $rdf.sym(oldData.webId),
            predicate: predicateMap[pred],
            object: oldData[pred]
          })
        }
      }
    }
    toAdd.addAll(insertTriples.map((t) => {
      if (t.predicate.uri === PRED.email.uri) {
        t.object = $rdf.sym(`mailto:${t.object}`)
      }
      return t
    }))
    toDel.addAll(deleteTriples.map((t) => {
      if (t.predicate.uri === PRED.email.uri) {
        t.object = $rdf.sym(`mailto:${t.object}`)
      }
      return t
    }))
    // All network requests will be contained here, later awaited by with
    // Promise.all
    let nodeCreationRequests = []
    nodeCreationRequests.push(this.http.patch(
      oldData.webId, toDel.statements, toAdd.statements
    ))
    return Promise.all(nodeCreationRequests).then(res => {
      return newData
    })
  }

  deletePassport(uri, imgUri) {
    const webId = this.getWebId()
    if (!webId) {
      throw new Error('No webid detected.')
    }

    const toDel = $rdf.graph()
    toDel.add(
      $rdf.sym(webId),
      PRED.passport,
      $rdf.sym(uri)
    )

    return Promise.all([
      this.http.delete(uri),
      this.http.delete(uri + '.acl'),
      this.http.delete(imgUri),
      this.http.delete(imgUri + '.acl'),
      this.http.patch(webId, toDel.statements)
    ])
  }

  updatePassport(uri, oldImgUri, imgUri) {
    const webId = this.getWebId()
    if (!webId) {
      throw new Error('No webid detected.')
    }
    const toDel = $rdf.graph()
    const toAdd = $rdf.graph()

    toDel.add(
      $rdf.sym(uri),
      PRED.image,
      oldImgUri
    )

    toAdd.add(
      $rdf.sym(uri),
      PRED.image,
      imgUri
    )

    return Promise.all([
      this.http.patch(uri, toDel.statements, toAdd.statements),
      this.http.delete(oldImgUri),
      this.http.delete(oldImgUri + '.acl')
    ])
  }
}

export default WebIDAgent
