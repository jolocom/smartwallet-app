import React from 'react'
import ReactDOM from 'react/lib/ReactDOM'
import Reflux from 'reflux'
import Radium from 'radium'
import moment from 'moment'

import {AppBar, IconButton} from 'material-ui'

import {Layout, Content} from 'components/layout'

import Dialog from 'components/common/dialog.jsx'
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
    ConversationActions.load(this.context.profile.webid, this.props.params.id)
    ConversationActions.subscribe(this.context.profile.webid, this.props.params.id)

    this.refs.dialog.show()

    this.conversationsEl = ReactDOM.findDOMNode(this.refs.conversations)

    this.conversationsEl.addEventListener('scroll', this.onScroll)

    this.interval = setInterval(() => {
      if (this.state.atBottom) {
        this.conversationsEl.scrollTop = this.conversationsEl.scrollHeight
      }
    }, 100)
  },

  componentWillUnmount() {
    this.refs.dialog.hide()

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

  addMessage(content) {
    ConversationActions.addMessage(
      this.props.params.id,
      this.context.profile.webid,
      content
    )
    return true
  },

  getStyles() {
    let styles = {
      content: {
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'visible'
      },
      conversation: {
        flex: 1,
        overflowY: 'auto',
        backgroundColor: '#f1f1f1'
      },
      message: {
        padding: '0 20px',
        marginBottom: '10px',
        overflow: 'hidden'
      },
      body: {
        borderTopLeftRadius: '6px',
        borderTopRightRadius: '6px',
        borderBottomLeftRadius: '6px',
        borderBottomRightRadius: '6px',
        padding: '6px 12px',
        position: 'relative'
      },
      meta: {
        clear: 'both',
        color: 'rgba(0, 0, 0, 0.3)',
        padding: '0 6px',
        fontSize: '12px'
      },
      contact: {
        body: {
          float: 'left',
          background: '#ffffff',
          borderTopLeftRadius: 0
        },
        meta: {
          textAlign: 'left'
        }
      },
      me: {
        body: {
          float: 'right',
          background: 'rgba(0, 0, 0, 0.15)',
          borderTopRightRadius: 0
        },
        meta: {
          textAlign: 'right'
        }
      }
    }
    return styles
  },

  render() {
    let styles = this.getStyles()

    let {conversation} = this.state
    let {otherPerson} = conversation

    let {profile} = this.context
    let title = otherPerson && otherPerson.name
    let items = conversation.items || []

    return (
      <Dialog ref="dialog" fullscreen={true}>
        <Layout>
          <AppBar
          title={title}
          iconElementLeft={
            <IconButton onClick={() => this.context.history.pushState(null, '/chat')} iconClassName="material-icons">arrow_back</IconButton>
          }
          />
        <Content style={styles.content}>
            <div ref="conversations" style={styles.conversation}>
              {items.map(function({author, content, created}, i) {
                let from = (author !== profile.webid) ? 'contact' : 'me'
                return (
                  <div style={[styles.message]} key={i}>
                    <div style={[styles.body, styles[from].body]}>{content}</div>
                    <div style={[styles.meta, styles[from].meta]}>
                      <span style={styles.date}>{moment(created).fromNow()}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            <Compose placeholder="Write a message..." onSubmit={this.addMessage}/>
          </Content>
        </Layout>
      </Dialog>
    )
  }
})

export default Radium(Conversation)
