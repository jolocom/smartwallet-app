import React from 'react'
import ReactDOM from 'react-dom'
import Reflux from 'reflux'
import Radium from 'radium'
import moment from 'moment'

<<<<<<< HEAD:src/js/components/chat/conversation.jsx
import { connect } from 'redux/utils'

import {AppBar, IconButton} from 'material-ui'
=======
import {AppBar, IconButton, FlatButton} from 'material-ui'
>>>>>>> origin/develop:src/js/components/chat/conversation/index.jsx

import {Layout, Content} from 'components/layout'

import Dialog from 'components/common/dialog'
import Compose from 'components/common/compose'
import UserAvatar from 'components/common/user-avatar'
import Loading from 'components/common/loading'

import ConversationSettings from './settings'

import UnreadMessagesActions from 'actions/unread-messages'
import ConversationActions from 'actions/conversation'
import ConversationStore from 'stores/conversation'

import ContactActions from 'actions/contact'
import ContactStore from 'stores/contact'

import ProfileStore from 'stores/profile'

let Conversation = React.createClass({

  mixins: [
    Reflux.connect(ConversationStore, 'conversation'),
    Reflux.connect(ContactStore, 'contact'),
    Reflux.connect(ProfileStore, 'profile')
  ],

  contextTypes: {
    router: React.PropTypes.any,
    account: React.PropTypes.any,
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    params: React.PropTypes.object,
    showDialog: React.PropTypes.func.isRequired,
    hideDialog: React.PropTypes.func.isRequired
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

    ConversationActions.load(webId, id, true)

    this.showDialog('conversation_' + this.props.params.id)

    this.itemsEl = ReactDOM.findDOMNode(this.refs.items)
  },

  componentWillUnmount() {
    const {id} = this.props.params

    ConversationActions.unsubscribe(id)
    ConversationStore.cleanState()

    this.hideDialog('conversation_' + this.props.params.id)
  },

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.conversation && this.state.conversation) {
      ContactActions.load(this.state.conversation.username)
    }
    if (this.state.atBottom) {
      this.itemsEl.scrollTop = this.itemsEl.scrollHeight
    }
  },

  addMessage(content) {
    if (content.trim() && content.length !== 0) {
      ConversationActions.addMessage(
        this.state.conversation.uri,
        this.context.account.webId,
        content
      )
    }
    // @TODO update the state of all convos with the new lastMessage
    return true
  },

  back() {
    this.context.router.push('/conversations')
  },

  addParticipant(webId) {
    ConversationActions.addParticipant(this.state.conversation.uri, webId)
  },

  getStyles() {
    let styles = {
      content: {
        overflowY: 'visible',
        position: 'relative'
      },
      conversation: {
        flex: 1,
        overflowY: 'auto',
        paddingTop: '25px',
        backgroundColor: 'rgb(240, 240, 240)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: '75px'
      },
      compose: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '75px'
      }
    }
    return styles
  },

  getParticipant(uri) {
    let {participants} = this.state.conversation
    return participants.filter((p) => {
      return p.webId === uri
    })[0]
  },

  renderItems() {
    return this.state.conversation &&
      this.state.conversation.items.map((item, i) => {
        return (
          <ConversationItem
            conversation={this.state.conversation}
            item={item}
            author={this.getParticipant(item.author)}
            key={i}
          />
        )
      })
  },

  render() {
    let content
    let styles = this.getStyles()
    let {loading, participants, subject} = this.state.conversation
    let title
    let groupSettings

    // omit current user
    participants = participants || []
    participants = participants.filter((p) => {
      return p.webId !== this.context.account.webId
    })

    if (loading && !participants.length) {
      title = 'Loading...'
    } else if (participants.length === 1) {
      title = participants[0].name
    } else {
      if (subject && subject.trim()) {
        title = subject
      } else {
        title = participants.map(p => p.name).join(', ')
      }
      title = title.trim() || participants.map(p => p.name).join(', ')

      groupSettings = (
        <FlatButton
          onTouchTap={this._handleShowSettings}
        >
          Settings
        </FlatButton>
      )
    }

    if (loading) {
      content = <Loading style={styles.loading} />
    } else {
      content = this.renderItems()
    }

    return (
      <Dialog fullscreen>
        <Layout>
          <AppBar
            title={title}
            iconElementLeft={
              <IconButton
                onClick={this.back}
                iconClassName="material-icons">
                arrow_back
              </IconButton>
            }
            iconElementRight={groupSettings}
          />
          <Content style={styles.content}>
            <div ref="items" style={styles.conversation}>
              {content}
            </div>
            <Compose
              style={styles.compose}
              placeholder="Write a message..."
              onSubmit={this.addMessage}
            />
          </Content>
        </Layout>
        <ConversationSettings
          ref="settings"
          conversation={this.state.conversation}
        />
      </Dialog>
    )
  },

  _handleShowSettings() {
    this.refs.settings.show()
  }
})

@Radium
class ConversationItem extends React.Component {

  static propTypes = {
    author: React.PropTypes.object,
    item: React.PropTypes.object
  }

  static contextTypes = {
    account: React.PropTypes.object,
    profile: React.PropTypes.object,
    muiTheme: React.PropTypes.object
  }

  componentDidMount() {
    UnreadMessagesActions.read(this.context.account.webId, this.props.item.id)
  }

  getStyles() {
    const muiTheme = this.context.muiTheme

    return {
      message: {
        padding: '0 20px',
        marginBottom: '10px',
        overflow: 'hidden'
      },
      body: {
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
        borderBottomLeftRadius: '10px',
        borderBottomRightRadius: '10px',
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
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          maxWidth: '85%'
        },
        meta: {
          textAlign: 'left'
        }
      },
      me: {
        body: {
          float: 'right',
          background: muiTheme.palette.primary1Color,
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          maxWidth: '85%'
        },
        meta: {
          textAlign: 'right'
        }
      },
      contactAvatar: {
        body: {
          float: 'left',
          padding: 0,
          marginRight: '6px'
        },
        meta: {
          textAlign: 'left'
        }
      },
      meAvatar: {
        body: {
          float: 'right',
          padding: 0,
          marginLeft: '6px'
        },
        meta: {
          textAlign: 'right'
        }
      }
    }
  }

  render() {
    let styles = this.getStyles()
    let {account} = this.context

    let {author, content, created} = this.props.item

    let style
    let avatar
    if (author === account.webId) {
      style = 'me'
      avatar = (
        <UserAvatar
          name={this.context.profile.givenName}
          imgUrl={this.context.profile.imgUri}
        />
      )
    } else {
      style = 'contact'
      avatar = (
        <UserAvatar
          name={this.props.author.name}
          imgUrl={this.props.author.img}
        />
      )
    }

    return (
      <div style={[styles.message]}>
        <div style={[styles.body, styles[`${style}Avatar`].body]}>
          {avatar}
        </div>
        <div style={[styles.body, styles[style].body]}>
          {content}
        </div>
        <div style={[styles.meta, styles[style].meta]}>
          <span style={styles.date}>
            {moment(created).fromNow()}
          </span>
        </div>
      </div>
    )
  }
}

export default Radium(connect({
  actions: ['common/dialog:showDialog', 'common/dialog:hideDialog']
})(Conversation))
