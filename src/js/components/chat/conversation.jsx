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

import ContactActions from 'actions/contact'
import ContactStore from 'stores/contact'

export default React.createClass({

  mixins: [
    Reflux.connect(ConversationStore, 'conversation'),
    Reflux.connect(ContactStore, 'contact')
  ],

  contextTypes: {
    history: React.PropTypes.any,
    profile: React.PropTypes.any
  },

  getInitialState() {
    return {
      open: false
    }
  },

  componentDidMount() {
    ConversationActions.load(this.context.profile.username, this.props.params.id)
    this.open()
  },

  componentWillUnmount() {
    this.close()
  },

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.conversation && this.state.conversation) {
      ContactActions.load(this.state.conversation.username)
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

  addMessage(content) {
    ConversationActions.addMessage(
      this.props.params.id,
      this.context.profile.username,
      content
    )
  },

  render() {
    let classes = classNames('jlc-chat-user', 'jlc-dialog', 'jlc-dialog__fullscreen', {
      'is-opened': this.state.open
    })

    let {contact, conversation} = this.state
    let {profile} = this.context
    let title = contact && contact.name
    let items = conversation.items || []

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
                let from = (author !== profile.webid) ? 'contact' : 'me'
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
