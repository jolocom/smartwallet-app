import Reflux from 'reflux'
import Util from 'lib/util'
import ChatAgent from 'lib/agents/chat'

import ChatActions from 'actions/chat'
let {create} = ChatActions

let chatAgent = new ChatAgent()

export default Reflux.createStore({
  listenables: ChatActions,

  onCreate(initiator, ...participants) {
    let profileUrl = (username) => Util.uriToProxied(username)
    chatAgent.createConversation(profileUrl(initiator), participants.map(profileUrl))
      .then(create.completed)
  },

  onCreateCompleted(conversation) {
    this.trigger(conversation)
  }
})
