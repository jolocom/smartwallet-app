import Reflux from 'reflux'
import ProfileActions from 'actions/profile'
import GraphActions from 'actions/graph-actions'
import SnackbarActions from 'actions/snackbar'
import accountActions from '../actions/account'
import GraphAgent from 'lib/agents/graph'
import WebIDAgent from 'lib/agents/webid'
import {PRED} from 'lib/namespaces'
import Util from 'lib/util'
import rdf from 'rdflib'

let FOAF = rdf.Namespace('http://xmlns.com/foaf/0.1/')
let CERT = rdf.Namespace('http://www.w3.org/ns/auth/cert#')

let wia = new WebIDAgent()

export default Reflux.createStore({
  listenables: ProfileActions,

  init() {
    this.state = {
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
      webId: '',
      imgUri: '',
      storage: '',
      centerNode: null
    }

    this.listenTo(accountActions.logout, this.onLogout)
    this.gAgent = new GraphAgent()
  },

  getInitialState () {
    return this.state
  },

  onLoad() {
    wia.getWebID().then((webId) => {
      this.gAgent.fetchTriplesAtUri(webId).then((res) => {
        ProfileActions.load.completed(webId, res.triples)
      }).catch(ProfileActions.load.failed)
    })
  },

  onLoadFailed() {
    SnackbarActions.showMessage('Failed to load the WebId profile info.')
  },

  onLoadCompleted(webId, triples) {
    this.state.webId = webId
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
    predicateMap[PRED.bitcoin] = 'bitcoinAdressNodeUri'
    predicateMap[PRED.passport] = 'passportImgNodeUri'
    predicateMap[PRED.storage] = 'storage'

    for (var t of relevant) {
      if (predicateMap[t.predicate]) {
        const obj = t.object.uri ? t.object.uri : t.object.value
        this.state[predicateMap[t.predicate]] = obj
      }
    }

    // Emails are stored in form mailto:abc@gmail.com, we remove 'mailto:'
    // when displaying here.
    if (this.state.email) {
      this.state.email = this.state.email.substring(7, this.state.email.length)
    }

    if (this.state.bitcoinAdressNodeUri) {
      this.gAgent.findObjectsByTerm(
        this.state.bitcoinAdressNodeUri,
        PRED.description
      ).then(res => {
        this.state.bitcoinAddress = res.length ? res[0].value : ''
      })
    }

    if (this.state.passportImgNodeUri) {
      this.gAgent.findObjectsByTerm(
        this.state.passportImgNodeUri,
        PRED.image
      ).then(res => {
        this.state.passportImgUri = res.length ? res[0].value : ''
      })
    }

    if (this.state.imgUri) {
      fetch(Util.uriToProxied(this.state.imgUri), {
        method: 'HEAD',
        credentials: 'include'
      }).then(res => {
        if (!res.ok) {
          this.state.imgUri = ''
        }
        this.trigger(this.state)
      }).catch((e) => {
        this.state.imgUri = ''
        this.trigger(this.state)
      })
    } else {
      this.trigger(this.state)
    }
  },

  onLogout() {
    this.init()
  },

  /* @summary Updates the rdf profile based on input
  /* @param {object} params - {familyName: ,givenName: ,email: ,imgUri: }
   */

  onUpdate(newData) {
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
      if (newData[pred] !== this.state[pred]) {
        if (!this.state[pred] || newData[pred]) {
          // inserting
          insertTriples.push({
            subject: rdf.sym(this.state.webId),
            predicate: predicateMap[pred],
            object: newData[pred]
          })
        }
        if (!newData[pred] || this.state[pred]) {
          // delete
          deleteTriples.push({
            subject: rdf.sym(this.state.webId),
            predicate: predicateMap[pred],
            object: this.state[pred]
          })
        }
        this.state[pred] = newData[pred]
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

    if (deleteStatement.length > 0) {
      deleteStatement = `DELETE DATA { ${deleteStatement} }`
    }
    if (insertStatement.length > 0) {
      insertStatement = `INSERT DATA { ${insertStatement} }`
    }
    // All network requests will be contained here, later awaited by with
    // Promise.all
    let nodeCreationRequests = []
    nodeCreationRequests.push(fetch(Util.uriToProxied(this.state.webId), {
      method: 'PATCH',
      credentials: 'include',
      body: `${deleteStatement} ${insertStatement} ;`,
      headers: {
        'Content-Type': 'application/sparql-update'
      }
    }))
    if (this.state.passportImgUri.trim() !==
        newData.passportImgUri.trim()) {
      this.updatePassport(newData, nodeCreationRequests)
    }

    Promise.all(nodeCreationRequests).then(res => {
      const currentCenter = newData.graphState.center.uri
      if (currentCenter === this.state.webId) {
        GraphActions.drawAtUri(currentCenter, 0)
      }
    })
  },

  updatePassport(newData, nodeCreationRequests) {
    const imgUri = this.state.passportImgNodeUri.trim()
    const nodeUri = this.state.passportImgUri.trim()
    let centerNode = {
      uri: this.state.webId,
      storage: this.state.storage
    }

    if (imgUri.trim().length > 0) {
      nodeCreationRequests.push(this.gAgent.deleteTriple(
        this.state.webId,
        rdf.sym(this.state.webId),
        PRED.passport,
        rdf.sym(this.state.passportImgNodeUri)
      ))

      nodeCreationRequests
        .push(this.gAgent.deleteFile(nodeUri))
      nodeCreationRequests
        .push(this.gAgent.deleteFile(imgUri))

      nodeCreationRequests.push(Util.getAclUri(nodeUri).then(aclUri => {
        this.gAgent.deleteFile(aclUri)
      }))

      nodeCreationRequests.push(Util.getAclUri(imgUri).then(aclUri => {
        this.gAgent.deleteFile(aclUri)
      }))

      this.state.passportImgNodeUri = ''
      this.state.passportImgUri = ''

      if (newData.passportImgUri.trim().length > 0) {
        nodeCreationRequests.push(this.gAgent.createNode(
          this.state.webId,
          centerNode,
          'Passport',
          undefined,
          newData.passportImgUri,
          'passport',
          true
        ).then(res => {
          this.state.passportImgNodeUri = res
          this.state.passportImgUri = newData.passportImgUri
        }))
      }
    } else {
      nodeCreationRequests.push(this.gAgent.createNode(
        this.state.webId,
        centerNode,
        'Passport',
        undefined,
        newData.passportImgUri,
        'passport',
        true
      ).then(res => {
        this.state.passportImgNodeUri = res
        this.state.passportImgUri = newData.passportImgUri
      }))
    }
  },

    /*
    console.log(nodeCreationRequests)
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
    */

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
