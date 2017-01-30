import Reflux from 'reflux'
import _ from 'lodash'
import ChatAgent from 'lib/agents/chat'
import AccountsAgent from 'lib/agents/accounts'

import conversationsActions from 'actions/conversations'
import chatActions from 'actions/chat'
import AccountStore from 'stores/account'

import accountActions from '../actions/account'

let {load} = conversationsActions

export default Reflux.createStore({
  listenables: conversationsActions,

  items: [],

  init: function() {
    this.listenTo(chatActions.create.completed, this.onNew)
    this.listenTo(accountActions.logout, this.onLogout)

    this.agent = new ChatAgent()
  },

  getInitialState() {
    return {
      loading: false,
      hydrated: !!this.items.length,
      items: this.items
    }
  },

  onLogout() {
    this.items = []
  },

  getConversationByWebId(webId) {
    for (let conversation of this.items) {
      if (conversation.otherPerson &&
          conversation.otherPerson.webid &&
          conversation.otherPerson.webid.value === webId) {
        return conversation
      }
    }
  },

  getConversation(id) {
    for (let conversation of this.items) {
      if (conversation.id === id) {
        return conversation
      }
    }
  },

  getUri(webId, id) {
    return new Promise((resolve, reject) => {
      let conversation = this.getConversation(id)
      if (conversation) {
        resolve(conversation.uri)
      } else {
        this._getConversations(webId, id).then((conversations) => {
          if (conversations[0]) {
            resolve(conversations[0].uri)
          } else {
            reject()
          }
        })
      }
    })
  },

  _getConversations(webId, query) {
    let regEx = query && query !== '' && new RegExp(`.*${query}.*`, 'i')

    return this.agent.getInboxConversations(webId)
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          const accounts = new AccountsAgent()
          accounts.createConversationsContainer(webId)
        }
        return []
      })
      .then((conversations) => {
        let results = conversations.map((url) => {
          return this.agent.getConversation(url, webId)
        })

        return Promise.all(results)
      })
      .then((conversations) => {
        return _.chain(conversations).sortBy((conversation) => {
          return conversation.lastMessage && conversation.lastMessage.created ||
            conversation.created || -1
        }).filter((conversation) => {
          return conversation && (!regEx || conversation.id.match(regEx))
        }).value().reverse()
      })
  },

  onNew(conversation) {
    let existingConversation =
      this.getConversationByWebId(conversation.participants[1])

    if (existingConversation) {
      return
    }

    return this.agent.getConversation(
      conversation.url, AccountStore.state.webId
    ).then((conversationItem) => {
      this.items = this.items.concat(conversationItem)
      this.trigger({
        loading: false, hydrated: true, items: this.items
      })
      return conversation
    })
  },

  onLoad(webId, query) {
    this.trigger({
      loading: true,
      items: this.items
    })
    this._getConversations(webId, query).then(load.completed).catch(load.failed)
  },

  onLoadCompleted(conversations) {
    this.items = conversations

    this.trigger({
      loading: false,
      hydrated: true,
      items: this.items
    })
  },

  onLoadFailed() {
    this.items = []
    this.trigger({
      hydrated: false,
      loading: false,
      items: this.items
    })
  }

})
