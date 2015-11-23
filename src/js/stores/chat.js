import Reflux from 'reflux'
import settings from 'settings'
import ChatAgent from 'lib/agents/chat.js'

import ChatActions from 'actions/chat'
let {create} = ChatActions

let chatAgent = new ChatAgent()

export default Reflux.createStore({
  listenables: ChatActions,

  onCreate(initiator, ...participants) {
    let profileUrl = (username) => `${settings.endpoint}/${username}/profile/card#me`
    chatAgent.createConversation(profileUrl(initiator), participants.map(profileUrl))
      .then(create.completed)
  },

  onCreateCompleted(conversation) {
    this.trigger(conversation)
  }

})
