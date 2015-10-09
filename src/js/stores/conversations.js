import Reflux from 'reflux'
import _ from 'lodash'
import ConversationsActions from 'actions/conversations'

let {load, create, remove} = ConversationsActions

let conversations = []

export default Reflux.createStore({
  listenables: ConversationsActions,

  getInitialState() {
    return {
      loading: true,
      conversations: []
    }
  },

  onLoad() {
    load.completed()
  },

  onLoadCompleted() {
    this.trigger({
      loading: false,
      conversations: conversations
    })
  },

  onCreate(conversation) {
    create.completed(conversation)
  },

  onCreateCompleted(conversation) {
    conversations.push(conversation)
    this.trigger({
      conversations: conversations
    })
  },

  onRemove(uri) {
    remove.completed(uri)
  },

  onRemoveCompleted(uri) {
    conversations = _.reject(conversations, function(conversation) {
      return conversation.uri === uri
    })
    this.trigger({
      conversations: conversations
    })
  }

})
