import Reflux from 'reflux'
import _ from 'lodash'
import ChatAgent from 'lib/agents/chat'

import Debug from 'lib/debug'
let debug = Debug('stores:conversation')

let chatAgent = new ChatAgent()

import ConversationActions from 'actions/conversation'
import ConversationsStore from 'stores/conversations'

let {load, addMessage} = ConversationActions

export default Reflux.createStore({
  listenables: ConversationActions,

  state: {
    loading: true,
    items: []
  },

  getInitialState() {
    return this.state
  },

  onLoad(webId, id) {
    this.state = {
      loading: true,
      items: []
    }

    debug('onLoad with webId', webId, 'and id', id)
    this.trigger(this.state)

    ConversationsStore.getUri(webId, id).then((url) => {
      debug('Got conversation URI', url)
      return Promise.all([
        chatAgent.getConversation(url, webId),
        chatAgent.getConversationMessages(url)
      ]).then((result) => {
        let [conversation, items] = result
        load.completed(conversation, items)
      })
    }).catch((err) => {
      console.error('Couldn\'t get conversation URI', err)
    })
  },

  onLoadCompleted(conversation, items) {
    this.state = _.extend({
      loading: false,
      items: items
    }, conversation)

    this.trigger(this.state)
  },

  onSubscribe(webId, id) {
    ConversationsStore.getUri(webId, id).then((url) => {
      return chatAgent.getConversation(url).then((conversation) => {
        this.socket = new WebSocket(conversation.updatesVia)
        this.socket.onopen = function() {
          this.send(`sub ${url}`)
        }
        this.socket.onmessage = function(msg) {
          if (msg.data && msg.data.slice(0, 3) === 'pub') {
            ConversationActions.load(webId, id)
          }
        }
      })
    })
  },

  onAddMessage(uri, author, content) {
    return chatAgent.postMessage(uri, author, content)
      .then(() => {
        addMessage.completed({
          type: 'message',
          author: author,
          content: content
        })
      })
  },

  onAddMessageCompleted(item) {
    if (this.state.items) {
      this.state.items.push(item)
    } else {
      this.state.items = [item]
    }

    this.trigger(this.state)
  }

})
