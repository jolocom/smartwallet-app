import Reflux from 'reflux'
import Util from 'lib/util'
import PrivacyActions from 'actions/privacy-settings'
import AclAgent from 'lib/agents/acl'
import GraphAgent from 'lib/agents/graph'
import {Writer} from 'lib/rdf.js'
import rdf from 'rdflib'
import {PRED} from 'lib/namespaces'

export default Reflux.createStore({
  listenables: PrivacyActions,

  init() {
    this.gAgent = new GraphAgent()
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

  changePrivacyMode(mode) {
    if (mode === 'public' || mode === 'private') {
      this.state.privacyMode = mode
      this.trigger(this.state)
    }
  },

  removeContact(contact) {
    this.state.allowedContacts = this.state.allowedContacts.filter(el => {
      return contact.webId !== el.webId
    })
    contact.perm.forEach(permission => {
      this.aclAgent.removeAllow(contact.webId, permission)
    })
    this.trigger(this.state)
  },

  computeResult() {
  },

  // TODO User profile image / name.
  fetchInitialData(file) {
    let users = []

    this.init()
    this.aclAgent = new AclAgent(file)
    this.aclAgent.fetchInfo().then(data => {
      this.aclAgent.allAllowedUsers('read').forEach(user => {
        users.push({
          webId: user,
          perm: this.aclAgent.allowedPermissions(user, true)
        })
      })
      this.state.allowedContacts = users
      this.trigger(this.state)
    })
  },

  _allowRead(user) {
    if (user.indexOf('http://') !== 0 &&
        user.indexOf('https://') !== 0) {
      user = `https://${user}`
    }

    this.toAdd.push({
      webId: user,
      permission: 'read'
    })

    this.trigger(this.state)
  },

  _disallowRead(user) {
    if (user.indexOf('http://') !== 0 &&
        user.indexOf('https://') !== 0) {
      user = `https://${user}`
    }

    let found = false
    this.toAdd = this.toAdd.filter(entry => {
      if (entry.webId === user && entry.permission === 'read') {
        found = true
      }
      return !found
    })

    if (!found) {
      this.toRemove.push({
        webId: user,
        permission: 'write'
      })
    }
  },

  allowEdit(user) {
    if (user.indexOf('http://') !== 0 &&
        user.indexOf('https://') !== 0) {
      user = `https://${user}`
    }

    this.state.editAllowList.push({
      label: user,
      key: this.state.editAllowList.length,
      canEdit: false
    })
    this.trigger(this.state)
  },

  disallowEdit(user) {
    if (user.indexOf('http://') !== 0 &&
        user.indexOf('https://') !== 0) {
      user = `https://${user}`
    }

    this.state.editAllowList = this.state.editAllowList.filter(el =>
      el.label !== user
    )
    this.trigger(this.state)
  },

  commit() {
    this.aclAgent.commit()
    // this.aclAgent.commitIndex()
  }
})
