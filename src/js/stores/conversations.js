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

  onLoad(webId, query) {
    let regEx = query && query !== '' && new RegExp(`.*${query}.*`, 'i')

    return chatAgent.getInboxConversations(Util.uriToProxied(webId))
      .then(function(conversations) {
        let results = conversations.map((url) => chatAgent.getConversation(url))
        return Promise.all(results)
      })
      .then(function(conversations) {
        load.completed(_.chain(conversations).map((conversation) => {
          return conversation
        }).filter((conversation) => {
          return !regEx || conversation.id.match(regEx)
        }).value())
      })
  },

  onLoadCompleted(conversations) {
    this.items = conversations

    this.trigger({
      loading: false,
      items: this.items
    })
  }

})
