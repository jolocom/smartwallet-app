import React from 'react'
import Reflux from 'reflux'

import {IconButton, AppBar} from 'material-ui'

import {Layout, Content} from 'components/layout'

import SearchBar from 'components/common/search-bar.jsx'
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
    return (
      <Dialog ref="dialog" fullscreen>
        <Layout>
          <AppBar
            title="Select contact"
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
          <SearchBar ref="search" onChange={this.onSearch} />
          <Content>
            <ContactsList
              onClick={this.startChat}
              searchQuery={this.state.searchQuery}
            />
          </Content>
        </Layout>
      </Dialog>
    )
  }
})
