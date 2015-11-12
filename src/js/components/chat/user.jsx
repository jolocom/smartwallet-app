import React from 'react'
import Reflux from 'reflux'
import classNames from 'classnames'
import moment from 'moment'

import {
  Layout,
  IconButton,
  Spacer,
  Content
} from 'react-mdl'

import Compose from 'components/common/compose.jsx'

import ConversationActions from 'actions/conversation'
import ConversationStore from 'stores/conversation'

import ProfileStore from 'stores/profile'

import ContactActions from 'actions/contact'
import ContactStore from 'stores/contact'

export default React.createClass({

  mixins: [
    Reflux.connect(ConversationStore, 'conversation'),
    Reflux.connect(ProfileStore, 'profile'),
    Reflux.connect(ContactStore, 'contact')
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
    ConversationActions.load(this.props.params.username)
    ContactActions.load(this.props.params.username)
    this.open()
  },

  componentWillUnmount() {
    this.close()
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
    this.history.pushState(null, `chat/${username}`)
  },

  addMessage(content) {
    ConversationActions.addMessage({
      author: {
        id: this.state.profile.webid,
        name: this.state.profile.name
      },
      content: content
    })
  },

  render() {
    let classes = classNames('jlc-chat-user', 'jlc-dialog', 'jlc-dialog__fullscreen', {
      'is-opened': this.state.open
    })

    let {contact, conversation} = this.state
    let title = contact && contact.name
    let items = conversation.items || []
    console.log(conversation)
    return (
      <div className={classes}>
        <Layout>
          <header className="mdl-layout__header">
            <IconButton name="close" onClick={() => this.context.history.pushState(null, '/chat')} className="jlc-dialog__close-button"></IconButton>
            <div className="mdl-layout__header-row">
              <span className="mdl-layout-title">{title}</span>
              <Spacer></Spacer>
            </div>
          </header>
          <Content>
            <div className="jlc-conversation">
              {items.map(function({author, content, date}, i) {
                let from = (author.username === conversation.username) ? 'contact' : 'me'
                let classes = classNames('jlc-message', `jlc-message-from-${from}`)
                return (
                  <div className={classes} key={i}>
                    <div className="jlc-message-content">{content}</div>
                    <div className="jlc-message-meta">
                      <span className="jlc-message-date">{moment(date).fromNow()}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            <Compose placeholder="Write a message..." onSubmit={this.addMessage} className="jlc-compose-message"/>
          </Content>
        </Layout>
      </div>
    )
  }
})
