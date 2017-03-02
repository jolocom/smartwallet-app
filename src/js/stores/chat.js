import Reflux from 'reflux'
import ChatAgent from 'lib/agents/chat'

import ChatActions from 'actions/chat'

let {create} = ChatActions

export default class ChatStore extends Reflux.Store {
  constructor() {
    super()

    this.agent = new ChatAgent()
    this.state = {
      conversation: null
    }
    this.listenables = ChatActions
  }

  onReset() {
    this.setState({conversation: null})
  }

  onCreate(initiator, participants, subject) {
    this.agent.createConversation(initiator, participants, subject)
      .then(create.completed)
      .catch(create.failed)
  }

  onCreateCompleted(conversation) {
    this.setState({conversation})
  }

  onCreateFailed(e) {
    console.error('Creating conversation failed', e)
  }
}
