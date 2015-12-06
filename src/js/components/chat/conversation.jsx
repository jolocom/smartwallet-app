import React from 'react'
import ReactDOM from 'react-dom'
import Reflux from 'reflux'
import Radium from 'radium'
import classNames from 'classnames'
import moment from 'moment'

import {AppBar, IconButton} from 'material-ui'

import {Layout, Content} from 'components/layout'

import Compose from 'components/common/compose.jsx'

import ConversationActions from 'actions/conversation'
import ConversationStore from 'stores/conversation'

import ContactActions from 'actions/contact'
import ContactStore from 'stores/contact'

let Conversation = React.createClass({

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
      open: false,
      atBottom: true
    }
  },

  componentDidMount() {
    ConversationActions.load(this.context.profile.username, this.props.params.id)
    ConversationActions.subscribe(this.context.profile.username, this.props.params.id)

    this.open()

    this.conversationsEl = ReactDOM.findDOMNode(this.refs.conversations)

    this.conversationsEl.addEventListener('scroll', this.onScroll)

    this.interval = setInterval(() => {
      if (this.state.atBottom) {
        this.conversationsEl.scrollTop = this.conversationsEl.scrollHeight
      }
    }, 100)
  },

  componentWillUnmount() {
    this.close()

    this.conversationsEl.removeEventListener('scroll', this.onScroll)
  },

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.conversation && this.state.conversation) {
      ContactActions.load(this.state.conversation.username)
    }
  },

  onScroll() {
    let el = this.conversationsEl
    if (el.scrollTop >= el.scrollHeight - el.clientHeight) {
      this.setState({atBottom: true})
    } else {
      this.setState({atBottom: false})
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
    return true
  },

  getStyles() {
    let styles = {
      container: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 10,
        opacity: this.state.open ? 1 : 0,
        transform: this.state.open ? 'translate(0, 0)' : 'translate(0, 100%)',
        transition: 'opacity .3s, transform .3s'
      },
      content: {
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'visible'
      },
      conversation: {
        flex: 1,
        overflowY: 'auto'
      }
    }
    return styles
  },

  render() {
    let classes = classNames('jlc-chat-user', 'jlc-dialog', 'jlc-dialog__fullscreen', {
      'is-opened': this.state.open
    })

    let styles = this.getStyles()

    let {conversation} = this.state
    let {otherPerson} = conversation

    let {profile} = this.context
    let title = otherPerson && otherPerson.name
    let items = conversation.items || []

    return (
      <div style={styles.container}>
        <Layout>
          <AppBar
          title={title}
          iconElementLeft={
            <IconButton onClick={() => this.context.history.pushState(null, '/chat')} iconClassName="material-icons">arrow_back</IconButton>
          }
          />
        <Content style={styles.content}>
            <div className="jlc-conversation" ref="conversations" style={styles.conversation}>
              {items.map(function({author, content, created}, i) {
                let from = (author !== profile.webid) ? 'contact' : 'me'
                let classes = classNames('jlc-message', `jlc-message-from-${from}`)
                return (
                  <div className={classes} key={i}>
                    <div className="jlc-message-content">{content}</div>
                    <div className="jlc-message-meta">
                      <span className="jlc-message-date">{moment(created).fromNow()}</span>
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

export default Radium(Conversation)
