import Reflux from 'reflux'
import _ from 'lodash'
import Util from 'lib/util'
import ChatAgent from 'lib/agents/chat'

import ConversationsActions from 'actions/conversations'

let {load} = ConversationsActions

let chatAgent = new ChatAgent()

export default Reflux.createStore({
  listenables: ConversationsActions,

  items: [],

  getInitialState() {
    return {
      loading: true,
      items: this.items
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
    return chatAgent.getInboxConversations(Util.uriToProxied(webId))
      .then(function(conversations) {
        let results = conversations.map((url) => {
          return chatAgent.getConversation(url, webId)
        })

        return Promise.all(results)
      })
      .then(function(conversations) {
        return _.chain(conversations).map((conversation) => {
          return conversation
        }).filter((conversation) => {
          return conversation && (!regEx || conversation.id.match(regEx))
        }).value()
      })
  },

  onLoad(webId, query) {
    this._getConversations(webId, query).then(load.completed)
  },

  onLoadCompleted(conversations) {
    this.items = conversations

    this.trigger({
      loading: false,
      items: this.items
    })
  }

})
