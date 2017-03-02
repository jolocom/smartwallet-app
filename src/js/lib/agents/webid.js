import LDPAgent from './ldp.js'
import HTTPAgent from './http.js'
import {Parser} from '../rdf'
import {PRED} from '../namespaces.js'
import $rdf from 'rdflib'

// WebID related functions
class WebIDAgent extends LDPAgent {

  constructor() {
    super()

    this.http = new HTTPAgent({proxy: true})
  }

  // Gets the webId of the currently loged in user from local storage,
  getWebId() {
    const webId = localStorage.getItem('jolocom.webId')
    if (webId) {
      return webId
    }
    return ''
  }

  getProfile() {
    const webId = this.getWebId()

    if (!webId) {
      throw new Error('No webid detected.')
    }
    let parser = new Parser()
    return this.http.get(webId)
      .then((response) => {
        return response.text()
      }).then((text) => {
        return parser.parse(text, webId)
      }).then((answer) => {
        return this._parseProfile(webId, answer.triples)
      }).then((data) => {
        if (data.imgUri) {
          return this.http.head(data.imgUri)
            .then((res) => {
              return data
            })
            .catch((e) => {
              data.imgUri = null
              return data
            })
        }
        return Object.assign(data, {webId})
      })
  }

  _parseProfile(webId, triples) {
    let profile = {
      webId: webId
    }

    let relevant = triples.filter((t) => t.subject.uri === webId)

    let predicateMap = {}
    predicateMap[PRED.familyName] = 'familyName'
    predicateMap[PRED.givenName] = 'givenName'
    predicateMap[PRED.fullName] = 'fullName'
    predicateMap[PRED.image] = 'imgUri'
    predicateMap[PRED.email] = 'email'
    predicateMap[PRED.socialMedia] = 'socialMedia'
    predicateMap[PRED.mobile] = 'mobilePhone'
    predicateMap[PRED.address] = 'address'
    predicateMap[PRED.profession] = 'profession'
    predicateMap[PRED.company] = 'company'
    predicateMap[PRED.url] = 'url'
    predicateMap[PRED.creditCard] = 'creditCard'
    predicateMap[PRED.passport] = 'passportNodeUri'
    predicateMap[PRED.storage] = 'storage'

    for (var t of relevant) {
      if (predicateMap[t.predicate]) {
        const obj = t.object.uri ? t.object.uri : t.object.value
        profile[predicateMap[t.predicate]] = obj
      }
    }

    // Emails are stored in form mailto:abc@gmail.com, we remove 'mailto:'
    // when displaying here.
    if (profile.email) {
      profile.email = profile.email.substring(7, profile.email.length)
    }

    let {fullName, givenName, familyName} = profile
    if (!givenName && !familyName) {
      if (fullName) {
        let space = fullName.indexOf(' ')
        if (space !== -1) {
          profile.givenName = fullName.substring(0, space)
          profile.familyName = fullName.substring(
              profile.givenName.length + 1, fullName.length)
        }
      }
    }

    if (profile.passportNodeUri) {
      return this.findObjectsByTerm(
        profile.passportNodeUri,
        PRED.image
      ).then(res => {
        profile.passportImgUri = res.length ? res[0].value : ''
        return profile
      })
    } else {
      return profile
    }
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
