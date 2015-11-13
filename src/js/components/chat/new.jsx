import React from 'react'
import Reflux from 'reflux'
import classNames from 'classnames'

import {
  Layout,
  IconButton,
  Spacer,
  Content,
  Menu,
  MenuItem
} from 'react-mdl'

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
      open: false
    }
  },

  componentDidMount() {
    this.open()
  },

  componentWillUnmount() {
    this.close()
  },

  componentDidUpdate() {
    console.log(this.state)
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

  render() {
    let classes = classNames('jlc-chat-new', 'jlc-dialog', 'jlc-dialog__fullscreen', {
      'is-opened': this.state.open
    })

    return (
      <div className={classes}>
        <Layout>
          <header className="mdl-layout__header">
            <IconButton name="close" onClick={() => this.context.history.pushState(null, '/chat')} className="jlc-dialog__close-button"></IconButton>
            <div className="mdl-layout__header-row">
              <span className="mdl-layout-title">Select contact</span>
              <Spacer></Spacer>
              <nav className="mdl-navigation">
                <IconButton name="search" onClick={this.showSearch}/>
                <IconButton name="more_vert" id="node-more"></IconButton>
                <Menu target="node-more" align="right">
                  <MenuItem>Invite a friend</MenuItem>
                </Menu>
              </nav>
            </div>
          </header>
          <Content>
            <ContactsList onClick={this.startChat}/>
          </Content>
        </Layout>
      </div>
    )
  }
})
