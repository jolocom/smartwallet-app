import Reflux from 'reflux'
import _ from 'lodash'
import ChatAgent from 'lib/agents/chat'
import Subscription from 'lib/subscription'

let chatAgent = new ChatAgent()

import ConversationActions from 'actions/conversation'
import ConversationsStore from 'stores/conversations'

let {load, addMessage} = ConversationActions

const subscriptions = {}

export default Reflux.createStore({
  listenables: ConversationActions,

  state: {
    loading: true,
    items: []
  },

  getInitialState() {
    return this.state
  },

  cleanState() {
    this.state.loading = true
    this.state.items = []
    this.state.otherPerson = {}
  },

  onLoad(webId, id, subscribe) {
    // @TODO cache this url somewhere?
    ConversationsStore.getUri(webId, id).then((url) => {
      if (subscribe) {
        ConversationActions.subscribe(webId, id)
      }

      return Promise.all([
        chatAgent.getConversation(url, webId),
        chatAgent.getConversationMessages(url)
      ]).then((result) => {
        let [conversation, items] = result
        load.completed(conversation, items, subscribe)
      }).then(() => {

      })
    }).catch((err) => {
      console.error('Couldn\'t get conversation URI', err)
    })
  },

  onLoadCompleted(conversation, items, subscribe) {
    this.state = _.extend({
      loading: false,
      items: items
    }, conversation)

    this.trigger(this.state)
  },

  onSubscribe(webId, id) {
    if (subscriptions[id]) {
      return
    }

    ConversationsStore.getUri(webId, id).then((url) => {
      subscriptions[id] = new Subscription(url, () => {
        ConversationActions.load(webId, id)
      })
    })
  },

  onUnsubscribe(id) {
    if (subscriptions[id]) {
      subscriptions[id].stop()
      delete subscriptions[id]
    }
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
