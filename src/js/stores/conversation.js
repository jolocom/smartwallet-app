import Reflux from 'reflux'
import _ from 'lodash'

import ConversationActions from 'actions/conversation'

let {load, addMessage} = ConversationActions

import {conversations} from 'lib/fixtures'

export default Reflux.createStore({
  listenables: ConversationActions,

  getInitialState() {
    return {
      loading: true
    }
  },

  onLoad(username) {
    let conversation = _.findWhere(conversations, {username: username})
    load.completed(conversation)
  },

  onLoadCompleted(conversation) {
    this.conversation = conversation
    this.trigger(_.extend({
      loading: false
    }, conversation))
  },

  onAddMessage(item) {
    addMessage.completed(item)
  },

  onAddMessageCompleted(item) {
    this.conversation.items.push(item)
    this.trigger(this.conversation)
  }

})
