import Reflux from 'reflux'
import _ from 'lodash'
import ChatAgent from 'lib/agents/chat'

import ConversationsActions from 'actions/conversations'
import AccountStore from 'stores/account'

import accountActions from '../actions/account'

import Debug from 'lib/debug'
let debug = Debug('stores:conversations')

let {load} = ConversationsActions

export default Reflux.createStore({
  listenables: ConversationsActions,

  items: [],
  init: function() {
    this.listenTo(accountActions.logout, this.onLogout)
  },
  onLogout() {
    this.items = []
  },

  getInitialState() {
    return {
      loading: true,
      items: this.items
    }
  },
  getConversationByWebId(webId) {
    for (let conversation of this.items) {
      if (conversation.otherPerson &&
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
    debug('Getting URI for conversation with id ', id)
    return new Promise((resolve, reject) => {
      let conversation = this.getConversation(id)
      if (conversation) {
        debug('Found conversation in the items.')
        resolve(conversation.uri)
      } else {
        debug('Couldn\'t find conversation in the items;' +
          'retrieving all conversations.')
        this._getConversations(webId, id).then((conversations) => {
          debug('getUri received conversations', conversations)
          if (conversations[0]) {
            console.log('conversations[0].uri', conversations[0].uri)
            resolve(conversations[0].uri)
          } else {
            console.error('rejecting')
            reject()
          }
        })
      }
    })
  },

  _getConversations(webId, query) {
    let regEx = query && query !== '' && new RegExp(`.*${query}.*`, 'i')
    let chatAgent = new ChatAgent()
    return chatAgent.getInboxConversations(webId)
      .then(function(conversations) {
        debug('Received URLs of conversations', conversations)
        let results = conversations.map((url) => {
          return chatAgent.getConversation(url, webId)
        })

        return Promise.all(results)
      })
      .then(function(conversations) {
        debug('Received conversations', conversations)
        return _.chain(conversations).map((conversation) => {
          return conversation
        }).filter((conversation) => {
          // @TODO we don't want to display
          // conversations with no last messages ?
          return conversation && (!regEx || conversation.id.match(regEx))
          // && conversation.lastMessage
        }).value()
      })
  },
  onNew(conversation) {
    debug('Adding new conversation to list of conversations',
      conversation, this.items, AccountStore.state.webId)
    let chatAgent = new ChatAgent()
    return chatAgent.getConversation(conversation.url, AccountStore.state.webId)
      .then((conversationItem) => {
        debug('Triggering the state with the new conversation item ;' +
          'new state should be',
          {loading: false, items: this.items.concat(conversationItem)})
        this.items = this.items.concat(conversationItem)
        this.trigger({
          loading: false, items: this.items})
      })
      .then(() => conversation)
  },

  onLoad(webId, query) {
    debug('onLoad with webId', webId)
    this._getConversations(webId, query).then(load.completed)
  },

  onLoadCompleted(conversations) {
    debug('onLoadCompleted with conversations', conversations)
    this.items = conversations

    this.trigger({
      loading: false,
      items: this.items
    })
  }

})
