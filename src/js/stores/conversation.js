import Reflux from 'reflux'
import _ from 'lodash'
import Util from 'lib/util'
import ChatAgent from 'lib/agents/chat'

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

  getUrl(webId, id) {
    const rootUrl = Util.webidRoot(webId)
    return `${rootUrl}/little-sister/chats/${id}`
  },

  onLoad(username, id) {
    let url = this.getUrl(username, id)
    Promise.all([
      chatAgent.getConversation(url),
      chatAgent.getConversationMessages(url)
    ]).then((result) => {
      let [conversation, items] = result
      load.completed(conversation, items)
    })
  },

  onLoadCompleted(conversation, items) {
    this.items = items
    this.trigger(_.extend({
      loading: false,
      items: items
    }, conversation))
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
    console.log("onAddMessage() - author = "+author)

    let conversation = this.getUrl(author, id)
    author = Util.uriToProxied(author)

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
