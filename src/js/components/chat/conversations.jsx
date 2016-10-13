import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'

import moment from 'moment'

import {
  List,
  ListItem,
  Avatar
  // FloatingActionButton,
  // FontIcon
} from 'material-ui'
import {grey500} from 'material-ui/styles/colors'

import TimerMixin from 'react-timer-mixin'

import ConversationsActions from 'actions/conversations'
import ConversationsStore from 'stores/conversations'
import UserAvatar from 'components/common/user-avatar.jsx'

import Loading from 'components/common/loading.jsx'

let Conversations = React.createClass({

  mixins: [
    Reflux.connect(ConversationsStore, 'conversations'),
    TimerMixin
  ],

  propTypes: {
    children: React.PropTypes.node,
    searchQuery: React.PropTypes.string,
    profile: React.PropTypes.object
  },

  contextTypes: {
    router: React.PropTypes.any,
    account: React.PropTypes.any
  },

  componentDidMount() {
    this.loadConversations() // @TODO Redundant? did on login
  },

  componentDidUpdate(prevProps) {
    if (prevProps.searchQuery &&
      prevProps.searchQuery !== this.props.searchQuery) {
      this.loadConversations()
    }
  },

  loadConversations() {
    // @TODO Component mounts again after choosing a contact (+)
    // This triggers .load unnecessarily
    ConversationsActions.load(
      this.context.account.webId, this.props.searchQuery
    )
  },

  showConversation({id}) {
    this.context.router.push(`/conversations/${id}`)
  },

  renderItems(items) {
    // maybe do this in the store already?
    items.sort(
      (itemA, itemB) => {
        if (!itemA.lastMessage) {
          if (!itemB.lastMessage) {
            return 0
          } else {
            return -1
          }
        } else if (!itemB.lastMessage) {
          return 1
        }
        return itemA.lastMessage.created.getTime() <
          itemB.lastMessage.created.getTime()
      }
    )

    return (
      <List>
        {items.map((conversation) => {
          return <ConversationsListItem
            key={conversation.id}
            conversation={conversation}
            onTouchTap={this.showConversation}

          />
        })}
      </List>
    )
  },

  render: function() {
    let content

    let {loading, items} = this.state.conversations
    // items = items.filter(conv => conv.lastMessage !== null)

    if (loading) {
      content = <Loading style={styles.loading} />
    } else if (!items || !items.length) {
      content = <div style={styles.empty}>No conversations</div>
    } else {
      content = this.renderItems(items)
    }

    return (
      <div style={styles.container}>

        <div style={styles.content}>
          {content}
        </div>

        {/* <FloatingActionButton */}
          {/* secondary */}
          {/* href="#/chat/new" */}
          {/* linkButton={true} */}
          {/* style={styles.actionButton} */}
        {/* > */}
          {/* <FontIcon className="material-icons">add</FontIcon> */}
        {/* </FloatingActionButton> */}

        {this.props.children}
      </div>
    )
  }
})

let ConversationsListItem = React.createClass({

  propTypes: {
    conversation: React.PropTypes.object.isRequired,
    onTouchTap: React.PropTypes.func.isRequired
  },

  render() {
    let {conversation} = this.props
    let {otherPerson, lastMessage} = conversation
    let {created, content} = lastMessage || {}

    // If otherPerson var is null, then set it to false.
    // So it wont be used when listing conversations
    // to avoid errors

    if (otherPerson == null) {
      otherPerson = false
    }

    let avatar = <UserAvatar name={otherPerson.name} imgUrl={otherPerson.img} />

    let date = moment(created).fromNow()
    return (
      <ListItem
        key={conversation.id}
        primaryText={
          <div>
            <span>{otherPerson.name || 'Unnamed'}</span>
            <span style={styles.date}>{date}</span>
          </div>
        }
        secondaryText={content}
        leftAvatar={<Avatar>{avatar}</Avatar>}
        onTouchTap={this._handleListItemTouchTap}
      />
    )
  },

  _handleListItemTouchTap() {
    this.props.onTouchTap(this.props.conversation)
  }
})

let styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  content: {
    overflowY: 'auto',
    flex: 1
  },
  loading: {
    position: 'absolute'
  },
  empty: {
    position: 'absolute',
    fontWeight: 300,
    color: grey500,
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px'
  },
  date: {
    color: grey500,
    fontSize: '12px',
    float: 'right'
  },
  actionButton: {
    position: 'absolute',
    right: '16px',
    bottom: '16px'
  }
}

export default Radium(Conversations)
