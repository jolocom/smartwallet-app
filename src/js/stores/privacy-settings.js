import Reflux from 'reflux'
import PrivacyActions from 'actions/privacy-settings'
import AclAgent from 'lib/agents/acl'
import GraphAgent from 'lib/agents/graph'

export default Reflux.createStore({
  listenables: PrivacyActions,

  init() {
    this.gAgent = new GraphAgent()
    this.webId = localStorage.getItem('jolocom.webId')

    this.state = {
      currActiveViewBtn: 'visOnlyMe',
      currActiveEditBtn: 'editOnlyMe',

      viewAllowList: [],
      editAllowList: [],

      friendViewAllowList: [],
      friendEditAllowList: [],

      friendViewDisallowList: [],
      friendEditDisallowList: [],

      isSelectAllOnlyMe: false,
      isSelectAllFriends: false,

      allowFriendList: []
    }
  },

  getInitialState() {
    return this.state
  },

  navigate(activeView, activeEdit) {
  // TODO Evaluate the alternative.
  /*
    if (activeEdit === 'editEveryone') {
      this.aclAgent.allow('*', 'write')
    } else if (activeView === 'viewEveryone') {
      this.aclAgent.allow('*', 'read')
    } else if (activeView === 'visFriends') {
      console.log(this.state.friendList)
    }
  */
    if (activeView) {
      this.state.currActiveViewBtn = activeView
    }

    if (activeEdit) {
      this.state.currActiveEditBtn = activeEdit
    }

    this.trigger(this.state)
  },

  computeResult() {
    this.aclAgent.resetAcl()
    this.aclAgent.allow(this.webId, 'read')
    this.aclAgent.allow(this.webId, 'control')
    this.aclAgent.allow(this.webId, 'write')

    if (this.state.currActiveViewBtn === 'visOnlyMe') {
      this.state.viewAllowList.forEach(el => {
        this.aclAgent.allow(el.label, 'read')
        if (el.canEdit) {
          this.aclAgent.allow(el.label, 'write')
        }
      })
    } else if (this.state.currActiveViewBtn === 'visFriends') {
      this.state.friendViewAllowList.forEach(el => {
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
        this.state.friendEditAllowList.forEach(el => {
          this.aclAgent.allow(el.name, 'write')
        })
      } else if (this.state.currActiveEditBtn === 'editEveryone') {
        this.aclAgent.allow('*', 'write')
      }
    }
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

  fetchInitialData(user) {
    this.init()
    this.aclAgent = new AclAgent(user)
    this.aclAgent.fetchInfo().then((data) => {
      this.gAgent.findFriends(this.webId).then(res => {
        // We add all friends to the view list by default
        res.forEach(el => {
          this.state.friendViewAllowList.push({
            name: el.object.uri,
            canEdit: false
          })
        })
      }).then(() => {
        // Then we check if it is read all
        this.aclAgent.allowedPermissions('*').map(el => {
          if (el === 'read') {
            this.state.currActiveViewBtn = 'visEveryone'
          }
          if (el === 'write') {
            this.state.currActiveEditBtn = 'editEveryone'
          }
        })
        // If it is not vis all, then we check if it is only readable
        // for me, or for everyone.
        if (this.state.currActiveViewBtn !== 'visEveryone') {
          let onlyFriends = true
          // We get all people who can read the file.
          this.aclAgent.allAllowedUsers('read').map(el => {
            // We ignore the webId in the list
            if (el.uri !== this.webId) {
              // We check, if a person who is allowed to read the file is not
              // in our friend list, therefore the setting is set to
              // "Visible only me" + whitelist
              let flag = this.state.friendViewAllowList.filter(friend => {
                return friend.name === el.uri
              })
              if (flag.length === 0) {
                onlyFriends = false
              }
              // only visible to friends, we need to compute who has
              // write access besides read access.
              if (onlyFriends) {
                this.state.currActiveViewBtn = 'visFriends'
                this.aclAgent.allAllowedUsers('write').map(user => {
                  this.state.friendViewAllowList.forEach(el => {
                    if (el.name === user.uri) {
                      el.canEdit = true
                    }
                  })
                })
              } else {
                this.state.currActiveViewBtn = 'visOnlyMe'
              }
            }
          })
        }
      }).then(() => {
        this.trigger(this.state)
      })
    })
  },

  allowRead(user) {
    this.aclAgent.allow(user, 'read')
    this.state.viewAllowList.push({
      label: user,
      key: this.state.editAllowList.length,
      canEdit: false
    })
    this.trigger(this.state)
  },

  disallowRead(user) {
    this.state.viewAllowList = this.state.viewAllowList.filter(el =>
      el.label !== user
    )
    this.trigger(this.state)
  },

  friendAllowRead(user) {
    this.state.friendViewAllowList.push({
      name: user,
      canEdit: false
    })

    this.state.friendViewDisallowList =
      this.state.friendViewDisallowList.filter(el => el.label !== user)
    this.trigger(this.state)
  },

  friendDisallowRead(user) {
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
    this.aclAgent.allow(user, 'write')
    this.state.editAllowList.push({
      label: user,
      key: this.state.editAllowList.length,
      canEdit: false
    })
    this.trigger(this.state)
  },

  disallowEdit(user) {
    this.state.editAllowList = this.state.editAllowList.filter(el =>
      el.label !== user
    )
    this.trigger(this.state)
  },

  friendDisallowEdit(user) {
    this.state.friendEditDisallowList.push({
      label: user,
      key: this.state.friendEditDisallowList.length,
      canEdit: false
    })

    this.state.friendEditAllowList = this.state.friendEditAllowList.filter(el =>
      el.name !== user
    )
    this.trigger(this.state)
  },

  friendAllowEdit(user) {
    this.state.friendEditAllowList.push({
      name: user,
      canEdit: false
    })

    this.state.friendEditDisallowList =
      this.state.friendEditDisallowList.filter(el => el.label !== user)
    this.trigger(this.state)
  },

  commit() {
    this.aclAgent.commit()
    this.aclAgent.commitIndex()
  }
})
