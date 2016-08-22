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
    account: React.PropTypes.any
  },

  propTypes: {
    params: React.PropTypes.object
  },

  getInitialState() {
    return {
      open: false,
      atBottom: true
    }
  },

  componentDidMount() {
    const {webId} = this.context.account
    const {id} = this.props.params

    ConversationActions.load(webId, id)
    ConversationActions.subscribe(webId, id)

    this.refs.dialog.show()

    this.itemsEl = ReactDOM.findDOMNode(this.refs.items)

    this.itemsEl.addEventListener('scroll', this.onScroll)

    this.interval = setInterval(() => {
      if (this.state.atBottom) {
        this.itemsEl.scrollTop = this.itemsEl.scrollHeight
      }
    }, 100)
  },

  componentWillUnmount() {
    this.refs.dialog.hide()

    this.itemsEl.removeEventListener('scroll', this.onScroll)
  },

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.conversation && this.state.conversation) {
      ContactActions.load(this.state.conversation.username)
    }
  },

  onScroll() {
    let el = this.itemsEl
    if (el.scrollTop >= el.scrollHeight - el.clientHeight) {
      this.setState({atBottom: true})
    } else {
      this.setState({atBottom: false})
    }
  },

  addMessage(content) {
    ConversationActions.addMessage(
      this.state.conversation.uri,
      this.context.account.webId,
      content
    )
    return true
  },

  back() {
    this.context.history.pushState(null, '/conversations')
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
        position: 'relative',
        whiteSpace: 'pre'
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

    let {account} = this.context
    let title = otherPerson && otherPerson.name
    let items = conversation.items || []

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
                arrow_back
              </IconButton>
            }
          />
          <Content style={styles.content}>
            <div ref="items" style={styles.conversation}>
              {items.map(function({author, content, created}, i) {
                let from = (author !== account.webId) ? 'contact' : 'me'
                return (
                  <div style={[styles.message]} key={i}>
                    <div style={[styles.body, styles[from].body]}>
                      {content}
                    </div>
                    <div style={[styles.meta, styles[from].meta]}>
                      <span style={styles.date}>
                        {moment(created).fromNow()}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
            <Compose
              placeholder="Write a message..."
              onSubmit={this.addMessage}
            />
          </Content>
        </Layout>
      </Dialog>
    )
  }
})

export default Radium(Conversation)
