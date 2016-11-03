import Reflux from 'reflux'
import PrivacyActions from 'actions/privacy-settings'
import AclAgent from 'lib/agents/acl'

export default Reflux.createStore({
  listenables: PrivacyActions,
  init() {
    this.state = {
      currActiveViewBtn: 'visOnlyMe',
      currActiveEditBtn: 'editOnlyMe',

      viewAllowList: [],
      editAllowList: [],

      friendViewAllowList: [
        {
          name: 'Brendan',
          canEdit: false
        },
        {
          name: 'Eric',
          canEdit: false
        },
        {
          name: 'Grace',
          canEdit: false
        },
        {
          name: 'Kerem',
          canEdit: false
        },
        {
          name: 'Chelsea',
          canEdit: false
        }
      ],

      friendEditAllowList: [
        {
          name: 'Brendan',
          canEdit: false
        },
        {
          name: 'Eric',
          canEdit: false
        },
        {
          name: 'Grace',
          canEdit: false
        },
        {
          name: 'Kerem',
          canEdit: false
        },
        {
          name: 'Chelsea',
          canEdit: false
        }
      ],

      friendViewDisallowList: [],
      friendEditDisallowList: [],

      coreFriendList: ['Brendan', 'Eric', 'Grace', 'Kerem', 'Chelsea'], // TEMP

      isSelectAllOnlyMe: false,
      isSelectAllFriends: false,

      allowFriendList: [
      ]
    }
  },

  getInitialState() {
    return this.state
  },

  navigate(activeView, activeEdit) {
    if (activeView) {
      this.state.currActiveViewBtn = activeView
    }

    if (activeEdit) {
      this.state.currActiveEditBtn = activeEdit
    }

    this.trigger(this.state)
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
    this.aclAgent = new AclAgent(user)
    this.aclAgent.fetchInfo().then(this.trigger({}))
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
    // TODO, put logic
    this.state.viewAllowList = this.state.viewAllowList.filter(el =>
      el.label !== user
    )
    this.trigger(this.state)
  },

  friendAllowRead(user) {
    // TODO LOGIC
    this.state.friendViewAllowList.push({
      name: user,
      canEdit: false
    })

    this.state.friendViewDisallowList =
      this.state.friendViewDisallowList.filter(el => el.label !== user)
    this.trigger(this.state)
  },

  friendDisallowRead(user) {
    // TODO LOGIC
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
    this.aclAgent.removeAllow(user, 'read')
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
    // TODO LOGIC
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
    // TODO LOGIC
    this.state.friendEditAllowList.push({
      name: user,
      canEdit: false
    })

    this.state.friendEditDisallowList =
      this.state.friendEditDisallowList.filter(el => el.label !== user)
    this.trigger(this.state)
  }
})
