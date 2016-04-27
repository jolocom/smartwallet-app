import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'

import moment from 'moment'

import {List, ListItem, Avatar, FloatingActionButton, FontIcon} from 'material-ui'
import {grey500} from 'material-ui/styles/colors'

import TimerMixin from 'react-timer-mixin'

import ConversationsActions from 'actions/conversations'
import ConversationsStore from 'stores/conversations'

let Chat = React.createClass({

  mixins: [
    Reflux.connect(ConversationsStore, 'conversations'),
    TimerMixin
  ],

  contextTypes: {
    history: React.PropTypes.any,
    profile: React.PropTypes.any
  },

  componentDidMount() {
    this.loadConversations()
  },

  componentDidUpdate(prevProps) {
    if (prevProps.searchQuery && prevProps.searchQuery !== this.props.searchQuery) {
      this.loadConversations()
    }
  },

  loadConversations() {
    ConversationsActions.load(this.context.profile.username, this.props.searchQuery)
  },

  showConversation({id}) {
    this.context.history.pushState(null, `/conversations/${id}`)
  },

  render: function() {
    let emptyView
    let {items} = this.state.conversations

    if (!items || !items.length) {
      emptyView = <div style={styles.empty}>No conversations</div>
    }

    return (
      <div style={styles.container}>

        {emptyView}

        <div style={styles.content}>

          <List>
            {this.state.conversations.items.map((conversation) => {
              let {otherPerson} = conversation
              let {created, content} = conversation.lastMessage
              let avatar
              if (otherPerson)
                avatar = <Avatar src={otherPerson.img}>{otherPerson.name[0]}</Avatar>
              let date = moment(created).fromNow()
              return (
                <ListItem key={conversation.id} primaryText={
                  <div>
                    <span>{otherPerson.name}</span>
                    <span style={styles.date}>{date}</span>
                  </div>
                } secondaryText={content} leftAvatar={avatar} onTouchTap={() => this.showConversation(conversation)}/>
              )
            })}
          </List>

        </div>

        <FloatingActionButton linkButton={true}
          href="#/chat/new"
          style={styles.actionButton}>
          <FontIcon className="material-icons">add</FontIcon>
        </FloatingActionButton>

        {this.props.children}
      </div>
    )
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
  empty: {
    position: 'absolute',
    fontWeight: 300,
    color: grey500,
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent:'center',
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

export default Radium(Chat)
