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
  },

  getInitialState() {
    return this.state
  },

  // TODO CHECK
  changePrivacyMode(mode) {
    if (mode === 'public' || mode === 'private') {
      this.state.privacyMode = mode
      this.trigger(this.state)
    }
  },

  computeResult() {
    this.aclAgent.resetAcl()
    this.aclAgent.allow(this.webId, 'read')
    this.aclAgent.allow(this.webId, 'control')
    this.aclAgent.allow(this.webId, 'write')
    let indexUri = Util.getIndexUri()

    if (this.state.currActiveViewBtn === 'visOnlyMe') {
      this.state.viewAllowList.map(el => {
        this.aclAgent.allow(el.label, 'read')
        if (el.canEdit) {
          this.aclAgent.allow(el.label, 'write')
        }
      })
    } else if (this.state.currActiveViewBtn === 'visFriends') {
      this.state.friendViewAllowList.map(el => {
        this.aclAgent.allow(el.name, 'read')
        if (el.canEdit) {
          this.aclAgent.allow(el.name, 'write')
        }
      })
    } else if (this.state.currActiveViewBtn === 'visEveryone') {
      this.aclAgent.allow('*', 'read')
      if (this.state.currActiveEditBtn === 'editOnlyMe') {
        this.state.editAllowList.forEach(el => {
          this.aclAgent.allow(el.label, 'write')
        })
      } else if (this.state.currActiveEditBtn === 'editFriends') {
        this.state.friendViewAllowList.forEach(el => {
          this.aclAgent.allow(el.name, 'write')
        })
      } else if (this.state.currActiveEditBtn === 'editEveryone') {
        this.aclAgent.allow('*', 'write')
      }
    }
    // TODO, rethink a bit.
    this.gAgent.fetchTriplesAtUri(indexUri).then(res => {
      let indexWriter = new Writer()
      res.triples.map(el => {
        if (el.object.uri !== this.aclAgent.uri) {
          indexWriter.addTriple(el)
        }
      })
      this.aclAgent.Writer.find(undefined, undefined, undefined).map(result => {
        if (result.predicate.uri === PRED.mode.uri) {
          if (result.object.uri === PRED.read.uri) {
            this.aclAgent.Writer.find(result.subject, PRED.agent, undefined)
            .map(each => {
              indexWriter.addTriple(
                each.object,
                PRED.readPermission,
                rdf.sym(this.aclAgent.uri)
              )
            })
          } else if (result.object.uri === PRED.write.uri) {
            this.aclAgent.Writer.find(result.subject, PRED.agent, undefined)
            .map(each => {
              indexWriter.addTriple(
                each.object,
                PRED.writePermission,
                rdf.sym(this.aclAgent.uri)
              )
            })
          }
        }
      })
      return fetch(Util.uriToProxied(indexUri), {
        method: 'PUT',
        credentials: 'include',
        body: indexWriter.end(),
        headers: {
          'Content-Type': 'text/turtle'
        }
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Error while putting the file', res)
        }
      }).catch((e) => {
        console.error(e)
      })
    })
  },

  handleCheck(list, user) {
    if (list === 'visOnlyMe') {
      this.state.viewAllowList = this.state.viewAllowList.map(el => {
        if (el === user) {
          el.canEdit = !el.canEdit
        }
        return el
      })
    } else if (list === 'visFriends') {
      this.state.friendViewAllowList = this.state.friendViewAllowList.map(f => {
        if (f === user) {
          f.canEdit = !f.canEdit
        }
        return f
      })
    }
    this.trigger(this.state)
  },

  // TODO User profile image
  fetchInitialData(user) {
    let users = []

    this.init()
    this.aclAgent = new AclAgent(user)
    this.aclAgent.fetchInfo().then(data => {
      return this.aclAgent.allAllowedUsers('read').forEach(user => {
        users.push({
          webId: user,
          perm: this.aclAgent.allowedPermissions(user, true)
        })
      })
    })
    this.state.allowedContacts = users
    this.trigger(this.state)
  },

  allowRead(user) {
    if (user.indexOf('http://') !== 0 &&
        user.indexOf('https://') !== 0) {
      user = `https://${user}`
    }

    this.state.viewAllowList.push({
      label: user,
      key: this.state.editAllowList.length,
      canEdit: false
    })
    this.trigger(this.state)
  },

  disallowRead(user) {
    if (user.indexOf('http://') !== 0 &&
        user.indexOf('https://') !== 0) {
      user = `https://${user}`
    }

    this.state.viewAllowList = this.state.viewAllowList.filter(el =>
      el.label !== user
    )
    this.trigger(this.state)
  },

  friendAllowRead(user) {
    if (user.indexOf('http://') !== 0 &&
        user.indexOf('https://') !== 0) {
      user = `https://${user}`
    }

    this.state.friendViewAllowList.push({
      name: user,
      canEdit: false
    })

    this.state.friendViewDisallowList =
      this.state.friendViewDisallowList.filter(el => el.label !== user)
    this.trigger(this.state)
  },

  friendDisallowRead(user) {
    if (user.indexOf('http://') !== 0 &&
        user.indexOf('https://') !== 0) {
      user = `https://${user}`
    }

    this.state.friendViewDisallowList.push({
      label: user,
      key: this.state.friendViewDisallowList.length,
      canEdit: false
    })
    this.state.friendViewAllowList = this.state.friendViewAllowList.filter(el =>
      el.name !== user
    )

    this.trigger(this.state)
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

  friendDisallowEdit(user) {
    if (user.indexOf('http://') !== 0 &&
        user.indexOf('https://') !== 0) {
      user = `https://${user}`
    }

    this.state.friendViewAllowList =
    this.state.friendViewAllowList.filter(el => {
      return el.name !== user
    })
    this.state.friendEditDisallowList.push({
      label: user,
      key: this.state.friendEditDisallowList.length,
      canEdit: false
    })
    this.trigger(this.state)
  },

  friendAllowEdit(user) {
    if (user.indexOf('http://') !== 0 &&
        user.indexOf('https://') !== 0) {
      user = `https://${user}`
    }

    this.state.friendEditDisallowList =
      this.state.friendEditDisallowList.filter(el => el.label !== user)
    this.trigger(this.state)
  },

  commit() {
    this.aclAgent.commit()
    // this.aclAgent.commitIndex()
  }
})
