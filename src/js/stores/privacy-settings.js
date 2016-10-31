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

  fetchInitialData(user) {
    this.aclAgent = new AclAgent(user)
    this.aclAgent.fetchInfo().then(this.trigger({}))
  },

  allowRead(user) {
    this.aclAgent.allow(user, 'read')
    this.state.viewAllowList.push({
      label: user,
      key: this.state.editAllowList.length,
      canEdit: false,
      list: 'viewAllow'
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

  friendDisallowRead(user) {
    // TODO LOGIC
    this.state.friendViewDisallowList.push({
      label: user,
      key: this.state.friendViewDisallowList.length,
      canEdit: false,
      list: 'friendViewDisallow'
    })

    this.state.friendViewAllowList = this.state.friendViewAllowList.filter(el =>
      el.name !== user
    )

    this.trigger(this.state)
  },

  friendViewAllow(user) {
    // TODO LOGIC
    this.state.friendViewAllowList.push({
      name: user,
      canEdit: false
    })

    this.state.friendViewDisallowList = this.state.friendViewDisallowList.filter(el =>
      el.label !== user
    )
    this.trigger(this.state)
  },

  allowEdit(user) {
    this.aclAgent.removeAllow(user, 'read')
    this.state.editAllowList.push({
      label: user,
      key: this.state.editAllowList.length,
      canEdit: false,
      list: 'editAllow'
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
      canEdit: false,
      list: 'friendEditDisallow'
    })

    this.state.friendEditAllowList = this.state.friendEditAllowList.filter(el =>
      el.name !== user
    )
    this.trigger(this.state)
  }
})
