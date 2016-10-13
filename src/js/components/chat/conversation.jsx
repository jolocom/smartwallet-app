import React from 'react'
import ReactDOM from 'react/lib/ReactDOM'
import Reflux from 'reflux'
import Radium from 'radium'
import moment from 'moment'

import {AppBar, IconButton} from 'material-ui'

import {Layout, Content} from 'components/layout'

import Dialog from 'components/common/dialog.jsx'
import Compose from 'components/common/compose.jsx'
import UserAvatar from 'components/common/user-avatar.jsx'
import Loading from 'components/common/loading.jsx'

import ConversationActions from 'actions/conversation'
import ConversationStore from 'stores/conversation'

import ContactActions from 'actions/contact'
import ContactStore from 'stores/contact'

import ProfileStore from 'stores/profile'

import Debug from 'lib/debug'
let debug = Debug('components:conversation')

let Conversation = React.createClass({

  mixins: [
    Reflux.connect(ConversationStore, 'conversation'),
    Reflux.connect(ContactStore, 'contact'),
    Reflux.connect(ProfileStore, 'profile')
  ],

  contextTypes: {
    router: React.PropTypes.any,
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
    debug('componentDidMount; loading conversation with props', this.props)

    ConversationActions.load(webId, id)
    ConversationActions.subscribe(webId, id)

    this.refs.dialog.show()

    this.itemsEl = ReactDOM.findDOMNode(this.refs.items)
  },

  componentWillUnmount() {
    this.refs.dialog.hide()
  },

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.conversation && this.state.conversation) {
      debug('componentDidUpdate; loading conversation', this.state.conversation)
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
    ConversationStore.cleanState()
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
        backgroundColor: '#f1f1f1',
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
      },
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
          maxWidth: '85%',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
        },
        meta: {
          textAlign: 'left'
        }
      },
      me: {
        body: {
          float: 'right',
          background: '#B5CA11',
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          maxWidth: '85%',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
        },
        meta: {
          textAlign: 'right'
        }
      },
      otherPersonAvatar: {
        body: {
          float: 'left',
          background: '#F1F1F1',
          padding: 0,
          borderTopRightRadius: 0,
          marginRight: '6px'
        },
        meta: {
          textAlign: 'left'
        }
      },
      userAvatar: {
        body: {
          float: 'right',
          background: '#F1F1F1',
          padding: 0,
          borderTopRightRadius: 0,
          marginLeft: '6px'
        },
        meta: {
          textAlign: 'right'
        }
      }
    }
    return styles
  },

  renderItems() {
    let styles = this.getStyles()
    let {otherPerson} = this.state.conversation
    console.log('Conversation render! this.state.con ', this.state.conversation)
    console.log('oP ', otherPerson)
    let {account} = this.context
    let items = this.state.conversation.items || []

    var userAvatar = (
      <UserAvatar
        name={this.state.profile.givenName}
        imgUrl={this.state.profile.imgUri} />
    )

    return items.map(function({author, content, created}, i) {
      var otherPersonAvatar = (
        <UserAvatar
          name={author.charAt(8)}
          imgUrl={<otherPerson></otherPerson>.img}
          // imgUrl={author.img}
        />
      )

      let avatar = (author !== account.webId)
        ? 'otherPersonAvatar' : 'userAvatar'
      let from = (author !== account.webId)
        ? 'contact' : 'me'
      return (
        <div style={[styles.message]} key={i}>
          <div style={[styles.body, styles[avatar].body]}>
            {avatar === 'otherPersonAvatar' && otherPersonAvatar}
            {avatar === 'userAvatar' && userAvatar}
          </div>
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
    })
  },

  render() {
    let content
    let styles = this.getStyles()
    let {loading, otherPerson} = this.state.conversation
    let title = otherPerson && otherPerson.name

    if (loading) {
      content = <Loading style={styles.loading} />
    } else {
      content = this.renderItems()
    }

    return (
      <Dialog ref="dialog" fullscreen>
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
      </Dialog>
    )
  }
})

export default Radium(Conversation)
