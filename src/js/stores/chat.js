import Reflux from 'reflux'
import ChatAgent from 'lib/agents/chat'

import ChatActions from 'actions/chat'
let {create} = ChatActions

let chatAgent = new ChatAgent()

export default Reflux.createStore({
  listenables: ChatActions,

  onCreate(initiator, ...participants) {
    console.log('onCreate initiator',initiator,'participants',participants)
    chatAgent.createConversation(initiator, participants)
      .then(create.completed)
  },

  onCreateCompleted(conversation) {
    console.log('create completed with conversation', conversation)
    this.trigger(conversation)
    
    window.location.href='#/conversations/' + conversation.id
    /*window.history.pushState(
        null, 
        '/conversations/conversationId' + conversation.id
      )*/
  }
})
