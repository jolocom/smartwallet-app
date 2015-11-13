import Reflux from 'reflux'
import settings from 'settings'
import ChatAgent from 'lib/agents/chat.js'

let chatAgent = new ChatAgent()

import ConversationActions from 'actions/conversation'

let {load, addMessage} = ConversationActions

export default Reflux.createStore({
  listenables: ConversationActions,

  getInitialState() {
    return {
      loading: true,
      items: []
    }
  },

  onLoad(username, id) {
    let url = `${settings.endpoint}/${username}/little-sister/chats/${id}`
    chatAgent.getConversationMessages(url)
      .then(load.completed)
  },

  onLoadCompleted(items) {
    console.log('items', items)
    this.items = items
    this.trigger({
      loading: false,
      items: items
    })
  },

  onAddMessage(id, author, content) {
    let conversation = `${settings.endpoint}/${author}/little-sister/chats/${id}`
    author = `${settings.endpoint}/${author}/profile/card#me`

    return chatAgent.postMessage(conversation, author, content)
      .then(() => {
        addMessage.completed({
          type: 'message',
          author: author,
          content: content
        })
      })
  },

  onAddMessageCompleted(item) {
    this.items.push(item)
    this.trigger({
      items: this.items
    })
  }

})
