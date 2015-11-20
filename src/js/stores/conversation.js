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

  getUrl(username, id) {
    return `${settings.endpoint}/${username}/little-sister/chats/${id}`
  },

  onLoad(username, id) {
    chatAgent.getConversationMessages(this.getUrl(username, id))
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

  onSubscribe(username, id) {
    let url = this.getUrl(username, id)
    chatAgent.getConversation(url)
      .then((conversation) => {
        this.socket = new WebSocket(conversation.updatesVia)
        this.socket.onopen = function() {
          this.send(`sub ${url}`)
        }
        this.socket.onmessage = function(msg) {
          if (msg.data && msg.data.slice(0, 3) === 'pub') {
            ConversationActions.load(username, id)
          }
        }
      })
  },

  onAddMessage(id, author, content) {
    let conversation = this.getUrl(author, id)
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
