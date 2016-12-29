import Reflux from 'reflux'
import PrivacyActions from 'actions/privacy-settings'
import AclAgent from 'lib/agents/acl'
import GraphAgent from 'lib/agents/graph'
import WebidAgent from 'lib/agents/webid'

export default Reflux.createStore({
  listenables: PrivacyActions,

  init() {
    this.gAgent = new GraphAgent()

    const wia = new WebidAgent()
    this.webId = wia.getWebId()

    this.state = {
      privacyMode: 'private',
      allowedContacts: []
    }

    // We will store all modifications here, and apply them with a patch.
    this.toRemove = []
    this.toAdd = []
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

  // TODO User profile image / name.
  fetchInitialData(file) {
    // Resets the state
    this.init()
    this.aclAgent = new AclAgent(file)
    this.aclAgent.initialize().then(() => {
      this.aclAgent.allAllowedUsers('read').forEach(user => {
        if (user === '*') {
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

      this.trigger(this.state)
    })
  },

  allowRead(webId) {
    this.aclAgent.allow(webId, 'read')
    this.state.allowedContacts.push({webId})
    this.trigger(this.state)
  },

  disallowRead(user) {
    this.aclAgent.removeAllow(user, 'read')
  },

  allowEdit(user) {
    this.aclAgent.allow(user, 'write')
  },

  disallowEdit(user) {
    this.aclAgent.removeAllow(user, 'write')
  },

  commit() {
    this.aclAgent.commit()
    // this.aclAgent.commitIndex()
  }
})
