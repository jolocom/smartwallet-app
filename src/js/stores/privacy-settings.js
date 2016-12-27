import Reflux from 'reflux'
import PrivacyActions from 'actions/privacy-settings'
import AclAgent from 'lib/agents/acl'
import GraphAgent from 'lib/agents/graph'

export default Reflux.createStore({
  listenables: PrivacyActions,

  init() {
    this.gAgent = new GraphAgent()
    // TODO Use agent
    this.webId = localStorage.getItem('jolocom.webId')

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

  // TODO What should change here?
  changePrivacyMode(mode) {
    if (mode === 'public' || mode === 'private') {
      this.state.privacyMode = mode
      this.trigger(this.state)
    }
  },

  removeContact(contact) {
    this.state.allowedContacts = this.state.allowedContacts.filter(el =>
      contact.webId !== el.webId
    )

    /* TODO Reflect
    contact.perm.forEach(permission => {
      this.aclAgent.removeAllow(contact.webId, permission)
    })
    */
    this.trigger(this.state)
  },

  // TODO Implement
  computeResult() {
    /*
    this.aclAgent.initialize().then(() => {
      this.aclAgent.removeAllow('https://testdude.com', 'write')
      this.aclAgent.allow('https://testdude.com', 'control')
      this.aclAgent.commit()
    })
    */
  },

  // TODO User profile image / name.
  fetchInitialData(file) {
    // Resets the state
    this.init()
    this.aclAgent = new AclAgent(file)
    this.aclAgent._fetchInfo().then(data => {
      this.aclAgent.allAllowedUsers('read').forEach(user => {
        this.state.allowedContacts.push({
          webId: user,
          perm: this.aclAgent.allowedPermissions(user, true)
        })
      })
      this.trigger(this.state)
    })
  },

  // TODO Abstract http / https check.
  _allowRead(user) {
    if (user.indexOf('http://') !== 0 &&
        user.indexOf('https://') !== 0) {
      user = `https://${user}`
    }
    this.aclAgent.allow(user, 'read')
  },

  _disallowRead(user) {
    if (user.indexOf('http://') !== 0 &&
        user.indexOf('https://') !== 0) {
      user = `https://${user}`
    }
    this.aclAgent.removeAllow(user, 'read')
  },

  _allowEdit(user) {
    if (user.indexOf('http://') !== 0 &&
        user.indexOf('https://') !== 0) {
      user = `https://${user}`
    }
    this.aclAgent.allow(user, 'write')
  },

  _disallowEdit(user) {
    if (user.indexOf('http://') !== 0 &&
        user.indexOf('https://') !== 0) {
      user = `https://${user}`
    }
    this.aclAgent.removeAllow(user, 'write')
  },

  commit() {
    this.aclAgent.commit()
    // this.aclAgent.commitIndex()
  }
})
