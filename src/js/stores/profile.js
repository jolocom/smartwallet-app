import Reflux from 'reflux'
import ProfileActions from 'actions/profile'
import accountActions from '../actions/account'
import GraphStore from 'stores/graph-store'
import GraphAgent from 'lib/agents/graph'
import WebIDAgent from 'lib/agents/webid'
import {Parser} from 'lib/rdf'
import {PRED} from 'lib/namespaces'
import Util from 'lib/util'
import rdf from 'rdflib'

let FOAF = rdf.Namespace('http://xmlns.com/foaf/0.1/')
let CERT = rdf.Namespace('http://www.w3.org/ns/auth/cert#')

let wia = new WebIDAgent()

let profile = {}

let defaultProfile = {
  show: false,
  fullName: '',
  givenName: '',
  familyName: '',
  privacy: '',
  username: '',
  mobilePhone: '',
  email: '',
  address: '',
  socialMedia: '',
  profession: '',
  company: '',
  url: '',
  bitcoinAddress: '',
  bitcoinAddressNodeUri: '',
  passportImgUri: '',
  passportImgNodeUri: '',
  creditCard: '',
  webid: '#',
  imgUri: null
}

export default Reflux.createStore({
  listenables: ProfileActions,

  init() {
    this.listenTo(accountActions.logout, this.onLogout)
    this.listenTo(GraphStore, this.graphUpdate)
    this.gAgent = new GraphAgent()
  },

  graphUpdate(data) {
    if (data && data.center) {
      profile.storage = data.center.storage
      profile.currentNode = data.center.uri
      this.trigger(Object.assign({}, profile))
    }
  },

  getInitialState () {
    return profile
  },

  onShow() {
    profile.show = true
    this.trigger(Object.assign({}, profile))
  },

  onHide() {
    profile.show = false
    this.trigger(Object.assign({}, profile))
  },

  onLoad() {
    let parser = new Parser()
    wia.getWebID().then((user) => {
      return fetch(Util.uriToProxied(user), {
        method: 'GET',
        credentials: 'include'
      }).then((res) => {
        return res.text()
      }).then((text) => {
        return parser.parse(text, user)
      }).then((answer) => {
        ProfileActions.load.completed(user, answer.triples)
      }).catch(ProfileActions.load.failed)
    })
  },

  onLoadFailed(err) {
    console.error('Failed loading webid profile', err)
  },

  // change state from triples
  onLoadCompleted(webid, triples) {
    profile = Object.assign({}, defaultProfile)
    let relevant = triples.filter((t) => t.subject.uri === webid)
    profile.webid = webid
    for (var t of relevant) {
      let obj = t.object.uri ? t.object.uri : t.object.value
      if (t.predicate.uri === FOAF('givenName').uri) {
        profile.givenName = obj
      } else if (t.predicate.uri === FOAF('familyName').uri) {
        profile.familyName = obj
      } else if (t.predicate.uri === FOAF('name').uri) {
        profile.fullName = obj
      } else if (t.predicate.uri === FOAF('img').uri) {
        profile.imgUri = obj
      } else if (t.predicate.uri === FOAF('accountName').uri) {
        profile.socialMedia = obj
      } else if (t.predicate.uri === FOAF('phone').uri) {
        profile.mobilePhone = obj
      } else if (t.predicate.uri === FOAF('based_near').uri) {
        profile.address = obj
      } else if (t.predicate.uri === FOAF('currentProject').uri) {
        profile.profession = obj
      } else if (t.predicate.uri === FOAF('workplaceHomepage').uri) {
        profile.company = obj
      } else if (t.predicate.uri === FOAF('homepage').uri) {
        profile.url = obj
      } else if (t.predicate.uri === FOAF('holdsAccount').uri) {
        profile.creditCard = obj
      } else if (t.predicate.uri === FOAF('mbox').uri) {
        profile.email = obj.substring(obj.indexOf('mailto:') + 7, obj.length)
      } else if (t.predicate.uri === PRED.bitcoin.uri) {
        profile.bitcoinAddressNodeUri = obj
        this.gAgent.findObjectsByTerm(obj, PRED.description).then((res) => {
          profile.bitcoinAddress = res.length ? res[0].value : ''
        })
      } else if (t.predicate.uri === PRED.passport.uri) {
        profile.passportImgNodeUri = obj
        this.gAgent.findObjectsByTerm(obj, PRED.image).then((res) => {
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

    if (profile.imgUri) {
      fetch(Util.uriToProxied(profile.imgUri), {
        method: 'HEAD',
        credentials: 'include'
      }).then(res => {
        if (!res.ok) {
          profile.imgUri = null
          this.trigger(Object.assign({}, profile))
        } else {
          this.trigger(Object.assign({}, profile))
        }
      }).catch((e) => {
        profile.imgUri = null
        this.trigger(Object.assign({}, profile))
      })
    } else {
      this.trigger(Object.assign({}, profile))
    }
  },

  onLogout() {
    profile = {
      show: false,
      fullName: '',
      givenName: '',
      familyName: '',
      email: '',
      webid: '#',
      imgUri: null,
      passportImgUri: null,
      passportImgNodeUri: null
    }
  },

  /* @summary Updates the rdf profile based on input
  /* @param {object} params - {familyName: ,givenName: ,email: ,imgUri: }
   */

  onUpdate(params) {
    let newData = Object.assign({}, params)
    let oldData = Object.assign({}, profile)

    let insertTriples = []
    let deleteTriples = []
    let insertStatement = ''
    let deleteStatement = ''

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
            subject: rdf.sym(oldData.webid),
            predicate: predicateMap[pred],
            object: newData[pred]
          })
        }
        if (!newData[pred] || oldData[pred]) {
          // delete
          deleteTriples.push({
            subject: rdf.sym(oldData.webid),
            predicate: predicateMap[pred],
            object: oldData[pred]
          })
        }
      }
    }

    insertStatement = insertTriples.map((t) => {
      if (t.predicate.uri === FOAF('mbox').uri) {
        t.object = rdf.sym(`mailto:${t.object}`)
      }
      return rdf.st(t.subject, t.predicate, t.object).toNT()
    }).join(' ')

    deleteStatement = deleteTriples.map((t) => {
      if (t.predicate.uri === FOAF('mbox').uri) {
        t.object = rdf.sym(`mailto:${t.object}`)
      }
      return rdf.st(t.subject, t.predicate, t.object).toNT()
    }).join(' ')

    if (deleteStatement) {
      deleteStatement = `DELETE DATA { ${deleteStatement} }`
    }
    if (insertStatement) {
      insertStatement = `INSERT DATA { ${insertStatement} }`
    }

    let nodeCreationRequests = []

    /*
      was -> none
      was -> changed

      none -> added
    */

    const nodeUri = oldData.passportImgNodeUri.trim()
    const imgUri = oldData.passportImgUri.trim()
    let passportChanged = imgUri === newData.passportImgUri.trim()

    if (passportChanged) {
      if (imgUri > 0) {
        nodeCreationRequests
          .push(this.gAgent.deleteFile(Util.uriToProxied(nodeUri)))
        nodeCreationRequests
          .push(this.gAgent.deleteFile(Util.uriToProxied(imgUri)))

        nodeCreationRequests.push(Util.getAclUri(nodeUri).then(aclUri => {
          this.gAgent.deleteFile(aclUri)
        }))
        nodeCreationRequests.push(Util.getAclUri(imgUri).then(aclUri => {
          this.gAgent.deleteFile(aclUri)
        }))

        if (newData.passportImgUri.trim().length > 0) {
          nodeCreationRequests.push(this.gAgent.createNode(
            GraphStore.state.user,
            GraphStore.state.center,
            'Passport',
            undefined,
            newData.passportImgUri,
            'default',
            true
          ))
        }
      } else {
        nodeCreationRequests.push(this.gAgent.createNode(
          GraphStore.state.user,
          GraphStore.state.center,
          'Passport',
          undefined,
          newData.passportImgUri,
          'default',
          true
        ))
      }
    }

    // ############## BITCOIN
    let updateBtcFetch = []
    if (params.bitcoinAddress.trim() !== profile.bitcoinAddress.trim()) {
      if (!params.bitcoinAddress.trim()) {
        // IF NEW VALUE IS NO VALUE
        // DELETE
        // Delete node
        updateBtcFetch.push(fetch(
          Util.uriToProxied(params.bitcoinAddressNodeUri), {
            method: 'DELETE',
            credentials: 'include'
          }))
        // Delete node ACL
        updateBtcFetch.push(fetch(
          Util.uriToProxied(params.bitcoinAddressNodeUri + '.acl'), {
            method: 'DELETE',
            credentials: 'include'
          }))
        // Delete link
        let btcDeleteStatement = 'DELETE DATA { ' +
          rdf.st(rdf.sym(oldData.webid),
            PRED.isRelatedTo,
            rdf.sym(profile.bitcoinAddressNodeUri)).toNT() + ' '
        // Delete btc link
        btcDeleteStatement += rdf.st(rdf.sym(oldData.webid),
            PRED.bitcoin,
            rdf.sym(profile.bitcoinAddressNodeUri)).toNT() + ' }'
        updateBtcFetch.push(fetch(Util.uriToProxied(oldData.webid), {
          method: 'PATCH',
          credentials: 'include',
          body: btcDeleteStatement,
          headers: {
            'Content-Type': 'application/sparql-update'
          }
        }))
      } else if (!profile.bitcoinAddress.trim()) {
        // IF OLD VALUE IS NO VALUE
        // CREATE
        // Create node and create link
        updateBtcFetch.push(this.gAgent.createNode(GraphStore.state.user,
          GraphStore.state.center,
          'Bitcoin Address',
          params.bitcoinAddress,
          undefined, 'default').then(function(bitcoinNode) {
            newData.bitcoinAddressNodeUri = bitcoinNode.uri

          // Insert btc link
            let btcInsertStatement = 'INSERT DATA { ' +
              rdf.st(rdf.sym(oldData.webid),
                PRED.bitcoin, bitcoinNode).toNT() + ' }'

            return fetch(Util.uriToProxied(oldData.webid), {
              method: 'PATCH',
              credentials: 'include',
              body: btcInsertStatement,
              headers: {
                'Content-Type': 'application/sparql-update'
              }
            })
          }))
      } else {
        // UPDATE
        let btcDeleteStatement = 'DELETE DATA { ' +
          rdf.st(rdf.sym(params.bitcoinAddressNodeUri),
            PRED.description, profile.bitcoinAddress).toNT() + ' }'
        let btcInsertStatement = 'INSERT DATA { ' +
          rdf.st(rdf.sym(params.bitcoinAddressNodeUri),
            PRED.description, params.bitcoinAddress).toNT() + ' }'
        updateBtcFetch.push(fetch(
          Util.uriToProxied(params.bitcoinAddressNodeUri), {
            method: 'PATCH',
            credentials: 'include',
            body: `${btcDeleteStatement} ${btcInsertStatement} ;`,
            headers: {
              'Content-Type': 'application/sparql-update'
            }
          }))
      }
    }

        /*
        // CREATE PASSPORT
        // Create node and create link
        updatePassportFetch.push(this.gAgent.createNode(
          GraphStore.state.user, GraphStore.state.center, 'Passport',
          undefined, newData.passportImgUri, 'default', true).then(
            function(passportNodeUri) {
              newData.passportImgNodeUri = passportNodeUri

          // Insert passport link
              let passportInsertStatement = 'INSERT DATA { ' +
                rdf.st(rdf.sym(oldData.webid),
                  PRED.passport, rdf.sym(passportNodeUri)).toNT() + ' }'

              return fetch(Util.uriToProxied(oldData.webid), {
                method: 'PATCH',
                credentials: 'include',
                body: passportInsertStatement,
                headers: {
                  'Content-Type': 'application/sparql-update'
                }
              })
            }))
      }
      */
    /*
    return new Promise((resolve, reject) => {
      if (false && !deleteStatement && !insertStatement) { // @TODO
        this.trigger(Object.assign(profile, newData))
      } else {
         // @TODO don't send request when empty delete- & insertStatement
        fetch(Util.uriToProxied(oldData.webid), {
          method: 'PATCH',
          credentials: 'include',
          body: `${deleteStatement} ${insertStatement} ;`,
          headers: {
            'Content-Type': 'application/sparql-update'
          }
        }).then((result) => {
          return Promise.all(updateBtcFetch.concat(updatePassportFetch))
        }).then((result) => {
          if (params.currentNode) {
            GraphActions.drawAtUri(params.currentNode, 0)
          }
          profile.currentNode = params.currentNode
          this.trigger(Object.assign(profile, newData))
          resolve()
        }).catch((e) => {
          reject(e)
        })
      }
    })
    */
  },

  // extract RSA public key from triples
  _parseKey (keySubject, triples) {
    let relevant = triples.filter((t) => t.subject === keySubject)
    let exponents = relevant.filter((t) => t.predicate === CERT.exponent)
    let modulii = relevant.filter((t) => t.predicate === CERT.modulus)

    // pick out first encountered modulus and exponent
    return {
      exponent: (exponents.length === 0 ? null : exponents[0].object),
      modulus: (modulii.length === 0 ? null : modulii[0].object)
    }
  }
})
