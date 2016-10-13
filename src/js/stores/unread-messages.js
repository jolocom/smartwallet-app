import Reflux from 'reflux'

import ChatAgent from 'lib/agents/chat'
import WebIDAgent from 'lib/agents/webid'

import UnreadMessagesActions from 'actions/unread-messages'

import accountActions from '../actions/account'

let {load} = UnreadMessagesActions

export default Reflux.createStore({
  listenables: UnreadMessagesActions,

  items: [],

  init: function() {
    this.listenTo(accountActions.logout, this.onLogout)
  },

  getInitialState() {
    return {
      loading: false,
      items: this.items
    }
  },

  onLogout() {
    this.items = []
  },

  onLoad(webId) {
    this.trigger({
      loading: true
    })

    const chatAgent = new ChatAgent()

    chatAgent.getUnreadMessages(webId).then(load.completed).catch((error) => {
      // @TODO container should be created by the solid server
      if (error.message === '404') {
        console.log('container not found creating it')
        const wia = new WebIDAgent()
        wia.createUnreadMessagesContainer(webId)
      }

      return load.failed(error)
    })
  },

  onLoadCompleted(items) {
    console.log(items)
    this.items = items

    this.trigger({
      loading: false,
      items: this.items
    })
  },

  onLoadFailed(error) {
    this.trigger({
      loading: false
    })
  }

})
