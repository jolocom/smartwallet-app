import React from 'react'
import Reflux from 'reflux'

import {IconButton, AppBar} from 'material-ui'

import {Layout, Content} from 'components/layout'

import Dialog from 'components/common/dialog.jsx'

import ChatActions from 'actions/chat'
import ChatStore from 'stores/chat'
import ConversationsActions from 'actions/conversations'
import ConversationsStore from 'stores/conversations'

import ProfileStore from 'stores/profile'

import Debug from 'lib/debug'
let debug = Debug('components:new')

export default React.createClass({

  mixins: [
    Reflux.connect(ChatStore, 'conversation'),
    Reflux.connect(ConversationsStore, 'conversations'),
    Reflux.connect(ProfileStore, 'profile')
  ],

  propTypes: {
    params: React.PropTypes.object
  },

  contextTypes: {
    router: React.PropTypes.any
  },

  getInitialState() {
    return {
      open: false,
      searchQuery: ''
    }
  },

  componentDidMount() {
    this.refs.dialog.show()
  },

  componentWillMount() {
    if (this.props.params.webId) {
      debug('componentWillMount; starting chat with props', this.props.params)
      this.startChat(this.props.params.webId)
    } else {
      // @TODO load contact list
    }
  },

  componentWillUnmount() {
    this.refs.dialog.hide()
  },

  componentDidUpdate() {
    if (this.state.conversation && this.state.conversation.id) {
      debug('componentDidUpdate;' +
        'redirection to conversation URL, with state', this.state)
      this.context.router.push(
        `/conversations/${this.state.conversation.id}`
      )
    }
  },

  startChat(webId) {
    debug('Starting chat with', webId)

    if (!this.state.conversations.hydrated) {
      ConversationsActions.load(this.state.profile.webid)
      let unsub = ConversationsActions.load.completed.listen(() => {
        unsub()
        ChatActions.create(
          this.state.profile.webid, this.state.profile.webid, webId
        )
      })
    } else {
      ChatActions.create(
        this.state.profile.webid, this.state.profile.webid, webId
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
      /* content = (
        <ContactsList
          onClick={this.startChat}
          searchQuery={this.state.searchQuery}
        />
      )*/
    } else {
      // @TODO show loading screen
    }

    return (
      <Dialog ref="dialog" fullscreen>
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
