import Reflux from 'reflux'
import _ from 'lodash'
import ConversationsActions from 'actions/conversations'

let {load, create, remove} = ConversationsActions

import {conversations} from 'lib/fixtures'

export default Reflux.createStore({
  listenables: ConversationsActions,

  getInitialState() {
    return {
      loading: true,
      conversations: []
    }
  },

  onLoad() {
    load.completed(_.clone(conversations))
  },

  onLoadCompleted(conversations) {
    this.conversations = conversations
    this.trigger({
      loading: false,
      conversations: this.conversations
    })
  },

  onCreate(conversation) {
    create.completed(conversation)
  },

  onCreateCompleted(conversation) {
    this.conversations.push(conversation)
    this.trigger({
      conversations: this.conversations
    })
  },

  onRemove(uri) {
    remove.completed(uri)
  },

  onRemoveCompleted(uri) {
    this.conversations = _.reject(this.conversations, function(conversation) {
      return conversation.uri === uri
    })
    this.trigger({
      conversations: this.conversations
    })
  }

})
