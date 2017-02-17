import Reflux from 'reflux'
import ChatAgent from 'lib/agents/chat'

import ChatActions from 'actions/chat'
import ConversationsActions from 'actions/conversations'
let {create} = ChatActions

import Debug from 'lib/debug'
let debug = Debug('stores:chat')

let chatAgent = new ChatAgent()

export default Reflux.createStore({
  listenables: ChatActions,

  onCreate(initiator, ...participants) {
    debug('Creating chat')
    chatAgent.createConversation(initiator, participants)
      .then(({conversation, isNew}) => {
        if (isNew) {
          ConversationsActions.new(conversation)
        }
        return conversation
      })
      .then((conversation) => {
        setTimeout(() => create.completed(conversation), 1000)
      })
    // setTimeout because we need to wait for
    // the trigger update of the items by .new
  },

  onCreateCompleted(conversation) {
    debug('Create completed; triggering the new state', conversation)
    this.trigger(conversation)

    // window.location.href='#/conversations/' + conversation.id
  }
})
