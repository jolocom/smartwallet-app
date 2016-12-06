import LDPAgent from './ldp.js'
import {endpoint} from 'settings'
import {Parser} from '../rdf'
import {PRED} from '../namespaces.js'
import $rdf from 'rdflib'

const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/')

// WebID related functions
class WebIDAgent extends LDPAgent {

  // Should this send it to the proxy?
  isFakeIDAvailable(username) {
    return this.head(`${endpoint}/${username}`)
      .then(() => {
        return false
      }).catch(() => {
        return true
      })
  }

  // Gets the webId of the currently loged in user from local storage,
  // Why is this async?
  getWebID() {
    return new Promise((resolve, reject) => {
      const webId = localStorage.getItem('jolocom.webId')
      if (!webId) {
        reject(new Error('Not logged in'))
      } else {
        resolve(webId)
      }
    })
  }

  getProfile() {
    let parser = new Parser()
    return this.getWebID().then((webId) => {
      return this.get(this._proxify(webId))
        .then((response) => {
          return response.text()
        }).then((text) => {
          return parser.parse(text, webId)
        }).then((answer) => {
          return this._parseProfile(webId, answer.triples)
        }).then((data) => {
          if (data.imgUri) {
            return this.head(this._proxify(data.imgUri))
              .then((data) => {
                return data
              })
              .catch((e) => {
                data.imgUri = null
                return data
              })
          }
          return data
        })
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
    predicateMap[PRED.image] = 'imgUri'
    predicateMap[PRED.email] = 'email'
    predicateMap[PRED.socialMedia] = 'socialMedia'
    predicateMap[PRED.mobile] = 'mobilePhone'
    predicateMap[PRED.address] = 'address'
    predicateMap[PRED.profession] = 'profession'
    predicateMap[PRED.company] = 'company'
    predicateMap[PRED.url] = 'url'
    predicateMap[PRED.creditCard] = 'creditCard'
    predicateMap[PRED.passport] = 'passportImgNodeUri'
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

    if (profile.passportImgNodeUri) {
      this.findObjectsByTerm(
        profile.passportImgNodeUri,
        PRED.image
      ).then(res => {
        profile.passportImgUri = res.length ? res[0].value : ''
      })
    }

    let {fullName, givenName, familyName} = profile
    if (!givenName && !familyName) {
      if (fullName) {
        profile.givenName = fullName.substring(0, fullName.indexOf(' '))
        profile.familyName = fullName.substring(
            givenName.length + 1, fullName.length)
      }
    }

    return profile
  }

  updateProfile(newData, oldData) {
    return this.getWebID().then((webId) => {
      newData = Object.assign({}, newData)
      oldData = Object.assign({}, oldData)

      let toAdd = $rdf.graph()
      let toDel = $rdf.graph()
      let insertTriples = []
      let deleteTriples = []

      let predicateMap = {
        familyName: FOAF('familyName'),
        givenName: FOAF('givenName'),
        imgUri: FOAF('img'),
        email: FOAF('mbox'),
        socialMedia: FOAF('accountName'),
        mobilePhone: FOAF('phone'),
        address: FOAF('based_near'),
        profession: FOAF('currentProject'),
        company: FOAF('workplaceHomepage'),
        url: FOAF('homepage'),
        creditCard: FOAF('holdsAccount')
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

      return new Promise((resolve, reject) => {
        if (false && !deleteTriples.length && !insertTriples.length) {
          // @TODO
          resolve(newData)
        } else {
           // @TODO don't send request when empty delete- & insertStatement
          this.patch(
            this._proxify(oldData.webId), toDel.statements, toAdd.statements
          )
          .then((result) => {
            resolve(newData)
          })
          .catch((e) => {
            reject(e)
          })
        }
      })
    })
  }

  deleteBitcoinAddress(address) {
    return this.getWebID().then((webId) => {
      const toDel = $rdf.graph()

      toDel.add(
        $rdf.sym(webId),
        PRED.isRelatedTo,
        $rdf.sym(address)
      )

      toDel.add(
        $rdf.sym(webId),
        PRED.bitcoin,
        $rdf.sym(address)
      )

      return Promise.all([
        this.delete(this._proxify(address)),
        this.delete(this._proxify(address + '.acl')),
        this.patch(this._proxify(webId), toDel.statements)
      ])
    })
  }

  addBitcoinAddress(uri) {
    return this.getWebID().then((webId) => {
      const toAdd = $rdf.graph()

      toAdd.add(
        $rdf.sym(webId),
        PRED.bitcoin,
        $rdf.sym(uri)
      )

      return this.patch(this._proxify(webId), null, toAdd.statements)
    })
  }

  updateBitcoinAddress(uri, oldAddress, newAddress) {
    const toDel = $rdf.graph()
    const toAdd = $rdf.graph()

    toDel.add(
      $rdf.sym(uri),
      PRED.description,
      oldAddress
    )

    toAdd.add(
      $rdf.sym(uri),
      PRED.description,
      newAddress
    )

    return this.patch(this._proxify(uri), toDel.statements, toAdd.statements)
  }

  deletePassport(uri, imgUri) {
    return this.getWebID().then((webId) => {
      const toDel = $rdf.graph()

      toDel.add(
        $rdf.sym(webId),
        PRED.isRelatedTo,
        $rdf.sym(uri)
      )

      toDel.add(
        $rdf.sym(webId),
        PRED.passport,
        $rdf.sym(uri)
      )

      return Promise.all([
        this.delete(this._proxify(uri)),
        this.delete(this._proxify(uri + '.acl')),
        this.delete(this._proxify(imgUri)),
        this.delete(this._proxify(imgUri + '.acl')),
        this.patch(this._proxify(webId), toDel.statements)
      ])
    })
  }

  updatePassport(uri, oldImgUri, imgUri) {
    return this.getWebId().then((webId) => {
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
        this.patch(this._proxify(uri), toDel.statements, toAdd.statements),
        this.delete(this._proxify(oldImgUri)),
        this.delete(this._proxify(oldImgUri + '.acl'))
      ])
    })
  }

  addPassport(uri) {
    return this.getWebID().then((webId) => {
      const toAdd = $rdf.graph()

      toAdd.add(
        $rdf.sym(webId),
        PRED.passport,
        $rdf.sym(uri)
      )

      return this.patch(this._proxify(webId), null, toAdd.statements)
    })
  }

}

export default WebIDAgent
