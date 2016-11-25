import LDPAgent from './ldp.js'
import {endpoint} from 'settings'
import {Parser} from '../rdf'
import {PRED} from '../namespaces.js'
import $rdf from 'rdflib'

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
        })
    })
  }

  _parseProfile(webId, triples) {
    let profile = {
      webId: webId
    }

    let relevant = triples.filter((t) => t.subject.uri === webId)

    for (var t of relevant) {
      let obj = t.object.uri ? t.object.uri : t.object.value
      if (t.predicate.uri === PRED.givenName.uri) {
        profile.givenName = obj
      } else if (t.predicate.uri === PRED.familyName.uri) {
        profile.familyName = obj
      } else if (t.predicate.uri === PRED.fullName.uri) {
        profile.fullName = obj
      } else if (t.predicate.uri === PRED.image.uri) {
        profile.imgUri = obj
      } else if (t.predicate.uri === PRED.email.uri) {
        profile.email = obj.substring(obj.indexOf('mailto:') + 7, obj.length)
      } else if (t.predicate.uri === PRED.bitcoin.uri) {
        profile.bitcoinAddressNodeUri = obj
        this.findObjectsByTerm(obj, PRED.description).then((res) => {
          profile.bitcoinAddress = res.length ? res[0].value : ''
        })
      } else if (t.predicate.uri === PRED.passport.uri) {
        profile.passportImgNodeUri = obj
        this.findObjectsByTerm(obj, PRED.image).then((res) => {
          profile.passportImgUri = res.length ? res[0].value : ''
        })
      }
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
        familyName: PRED.familyName,
        givenName: PRED.givenName,
        imgUri: PRED.image,
        email: PRED.email
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
