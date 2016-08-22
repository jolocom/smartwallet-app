import React from 'react'
import Reflux from 'reflux'

import {IconButton, AppBar} from 'material-ui'

import {Layout, Content} from 'components/layout'

import Dialog from 'components/common/dialog.jsx'

import ContactsList from 'components/contacts/list.jsx'

import ChatActions from 'actions/chat'
import ChatStore from 'stores/chat'

import ProfileStore from 'stores/profile'

export default React.createClass({

  mixins: [
    Reflux.connect(ChatStore, 'conversation'),
    Reflux.connect(ProfileStore, 'profile')
  ],

  propTypes: {
    params: React.PropTypes.object
  },

  contextTypes: {
    history: React.PropTypes.any
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
      this.context.history.pushState(null,
        `/conversations/${this.state.conversation.id}`
      )
    }
  },

  startChat(webId) {
    ChatActions.create(
      this.state.profile.webid, this.state.profile.webid, webId
    )
  },

  showSearch() {
    this.refs.search.show()
  },

  onSearch(query) {
    this.setState({searchQuery: query})
  },

  back() {
    this.context.history.pushState(null, '/chat')
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
