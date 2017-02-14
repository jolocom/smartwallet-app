import React from 'react'
import Reflux from 'reflux'

import { connect } from 'redux/utils'

import {IconButton, AppBar} from 'material-ui'

import {Layout, Content} from 'components/layout'

import Dialog from 'components/common/dialog.jsx'

import ContactsList from 'components/contacts/list.jsx'

import ChatActions from 'actions/chat'
import ChatStore from 'stores/chat'
import ConversationsActions from 'actions/conversations'
import ConversationsStore from 'stores/conversations'

let NewChat = React.createClass({

  mixins: [
    Reflux.connect(ChatStore, 'conversation'),
    Reflux.connect(ConversationsStore, 'conversations')
  ],

  propTypes: {
    params: React.PropTypes.object,
    showDialog: React.PropTypes.func.isRequired,
    hideDialog: React.PropTypes.func.isRequired
  },

  contextTypes: {
    router: React.PropTypes.any,
    account: React.PropTypes.object
  },

  getInitialState() {
    return {
      open: false,
      searchQuery: ''
    }
  },

  componentDidMount() {
    this.showDialog('new_chat')
  },

  componentWillMount() {
    if (this.props.params.webId) {
      this.startChat(this.props.params.webId)
    } else {
      // @TODO load contact list
    }
  },

  componentWillUnmount() {
    this.hideDialog('new_chat')
  },

  componentDidUpdate() {
    if (this.state.conversation && this.state.conversation.id) {
      this.context.router.push(
        `/conversations/${this.state.conversation.id}`
      )
    }
  },

  startChat(webId) {
    if (!this.state.conversations.hydrated) {
      ConversationsActions.load(this.context.account.webId)
      let unsub = ConversationsActions.load.completed.listen(() => {
        unsub()
        ChatActions.create(
          this.context.account.webId, this.context.account.webId, webId
        )
      })
    } else {
      ChatActions.create(
        this.context.account.webId, this.context.account.webId, webId
      )
    }
  },

  showSearch() {
    this.refs.search.show()
  },

  onSearch(query) {
    this.setState({searchQuery: query})
  },

  back() {
    this.context.router.push('/chat')
  },

  render() {
    const {webId} = this.props.params

    let title = 'Select contact'

    let content

    if (!webId) {
      content = (
        <ContactsList
          onClick={this.startChat}
          searchQuery={this.state.searchQuery}
        />
      )
    } else {
      // @TODO show loading screen
    }

    return (
      <Dialog fullscreen>
        <Layout>
          <AppBar
            title={title}
            iconElementLeft={
              <IconButton
                onClick={this.back}
                iconClassName="material-icons"
              >
                close
              </IconButton>
            }
            iconElementRight={
              <IconButton
                onClick={this.showSearch}
                iconClassName="material-icons"
              >
                search
              </IconButton>}
            />
          <Content>
            {content}
          </Content>
        </Layout>
      </Dialog>
    )
  }
})

export default connect({
  actions: ['common/dialog:showDialog', 'common/dialog:hideDialog']
})(NewChat)
