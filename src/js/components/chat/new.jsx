import React from 'react'
import Reflux from 'reflux'
import classNames from 'classnames'

import {IconButton, AppBar} from 'material-ui'

import {Layout, Content} from 'components/layout'

import SearchBar from 'components/common/search-bar.jsx'

import ContactsList from 'components/contacts/list.jsx'

import ChatActions from 'actions/chat'
import ChatStore from 'stores/chat'

import ProfileStore from 'stores/profile'

export default React.createClass({

  mixins: [
    Reflux.connect(ChatStore),
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
    this.open()
  },

  componentWillUnmount() {
    this.close()
  },

  componentDidUpdate() {
    if (this.state.id) {
      this.context.history.pushState(null, `/conversations/${this.state.id}`)
    }
  },

  open() {
    this.setState({open: true})
  },

  close() {
    this.setState({open: false})
  },

  toggle() {
    this.setState({open: !this.state.open})
  },

  startChat(username) {
    ChatActions.create(this.state.profile.username, username)
  },

  showSearch() {
    this.refs.search.show()
  },

  onSearch(query) {
    this.setState({searchQuery: query})
  },

  render() {
    let classes = classNames('jlc-chat-new', 'jlc-dialog', 'jlc-dialog__fullscreen', {
      'is-opened': this.state.open
    })

    return (
      <div className={classes}>
        <Layout>
          <AppBar
          title="Select contact"
          iconElementLeft={
            <IconButton onClick={() => this.context.history.pushState(null, '/chat')} iconClassName="material-icons">close</IconButton>
          }
          iconElementRight={<IconButton onClick={this.showSearch} iconClassName="material-icons">search</IconButton>} />
          <SearchBar ref="search" onChange={this.onSearch}/>
          <Content>
            <ContactsList onClick={this.startChat} searchQuery={this.state.searchQuery}/>
          </Content>
        </Layout>
      </div>
    )
  }
})
