import Reflux from 'reflux'
import _ from 'lodash'
import ChatAgent from 'lib/agents/chat'
import Subscription from 'lib/subscription'

let chatAgent = new ChatAgent()

import ConversationActions from 'actions/conversation'
import ConversationsStore from 'stores/conversations'

let {load, addMessage, setSubject, addParticipants} = ConversationActions

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
  },

  onSetSubject(uri, subject) {
    const oldSubject = this.state.subject

    // Optimistic updates
    // @TODO we should do this throughout the app
    this.state.subject = subject
    this.trigger(this.state)

    return chatAgent.setSubject(uri, oldSubject, subject)
      .catch((e) => {
        setSubject.failed(e, oldSubject)
      })
  },

  onSetSubjectFailed(e, oldSubject) {
    this.state.subject = oldSubject
    this.trigger(this.state)
  },

  onAddParticipants(uri, participants) {
    const oldParticipants = this.state.participants.slice(0)

    this.state.participants = this.state.participants.concat(participants)

    this.trigger(this.state)

    chatAgent.addParticipants(uri, participants.map(p => p.webId))
      .catch((e) => {
        addParticipants.failed(e, oldParticipants)
      })
  },

  onAddParticipantsFailed(e, oldParticipants) {
    console.error(e)
    this.state.participants = oldParticipants
    this.trigger(this.state)
  }
})
