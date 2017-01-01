import Reflux from 'reflux'
import PrivacyActions from 'actions/privacy-settings'
import AclAgent from 'lib/agents/acl'
import GraphAgent from 'lib/agents/graph'
import WebidAgent from 'lib/agents/webid'
import {PRED} from 'lib/namespaces'

export default Reflux.createStore({
  listenables: PrivacyActions,

  init() {
    const wia = new WebidAgent()
    this.webId = wia.getWebId()
    this.state = {
      privacyMode: 'private',
      allowedContacts: []
    }
  },

  getInitialState() {
    return this.state
  },

  changePrivacyMode(mode) {
    if (mode !== this.state.privacyMode) {
      if (mode === 'public') {
        this.aclAgent.allow('*', 'read')
      } else {
        this.aclAgent.removeAllow('*', 'read')
      }
      this.state.privacyMode = mode
      this.trigger(this.state)
    }
  },

  removeContact(contact) {
    this.aclAgent.removeAllow(contact.webId, 'read')
    if (contact.edit) {
      this.aclAgent.removeAllow(contact.webId, 'write')
    }
    this.state.allowedContacts = this.state.allowedContacts.filter(el =>
      contact.webId !== el.webId
    )
    this.trigger(this.state)
  },

  fetchInitialData(file) {
    // Resets the state
    this.init()
    this.aclAgent = new AclAgent(file)
    this.aclAgent.initialize().then(() => {
      this.aclAgent.allAllowedUsers('read').forEach(user => {
        if (user === '*' || user === this.webId) {
          return
        }

        this.state.allowedContacts.push({
          webId: user,
          edit: this.aclAgent.isAllowed(user, 'write')
        })
      })

      if (this.aclAgent.isAllowed('*', 'read')) {
        this.state.privacyMode = 'public'
      }
    }).then(() => {
      return this._hydrateContacts().then(() => this.trigger(this.state))
    })
  },

  // @TODO This is a frequently needed function, abstract perhaps.
  _hydrateContacts() {
    const gAgent = new GraphAgent()
    return Promise.all(this.state.allowedContacts.map(contact => {
      return gAgent.fetchTriplesAtUri(contact.webId).then(tr => {
        tr.triples.forEach(tr => {
          if (tr.predicate.uri === PRED.image.uri) {
            contact.imgUri = tr.object.uri ? tr.object.uri : tr.object.value
          }
          if (tr.predicate.uri === PRED.givenName.uri ||
            tr.predicate.uri === PRED.fullName.uri) {
            contact.name = tr.object.value
          }
        })
      })
    }))
  },

  allowRead(contact) {
    this.aclAgent.allow(contact.webId, 'read')
    this.state.allowedContacts.push({
      webId: contact.webId,
      imgUri: contact.imgUri,
      name: contact.name
    })
    this.trigger(this.state)
  },

  allowEdit(user) {
    this.aclAgent.allow(user, 'write')
  },

  disallowEdit(user) {
    this.aclAgent.removeAllow(user, 'write')
  },

  commit() {
    this.aclAgent.commit()
  }
})
