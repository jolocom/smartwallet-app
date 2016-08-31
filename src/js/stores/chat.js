import Reflux from 'reflux'
import ChatAgent from 'lib/agents/chat'

import ChatActions from 'actions/chat'
let {create} = ChatActions

let chatAgent = new ChatAgent()

export default Reflux.createStore({
  listenables: ChatActions,

  onCreate(initiator, ...participants) {
    chatAgent.createConversation(initiator, participants)
      .then(create.completed)
  },

  onCreateCompleted(conversation) {
    this.trigger(conversation)
    
    // @TODO @FIXME
    window.location.href='#/conversations/' + conversation.id
    /*window.history.pushState(
        null, 
        '/conversations/conversationId' + conversation.id
      )*/
  }
})
