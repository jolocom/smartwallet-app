import React from 'react'
import Reflux from 'reflux'

import moment from 'moment'

// import FabMenu from 'components/common/fab-menu.jsx'
// import FabMenuItem from 'components/common/fab-menu-item.jsx'
//


import {List, ListItem, Avatar, Styles, FloatingActionButton, FontIcon} from 'material-ui'

let {Colors} = Styles

import TimerMixin from 'react-timer-mixin'

import ConversationsActions from 'actions/conversations'
import ConversationsStore from 'stores/conversations'

let Chat = React.createClass({

  mixins: [
    Reflux.connect(ConversationsStore),
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
    return (
      <div className="jlc-chat">
        <List className="jlc-chat-list">
          {this.state.conversations.map((conversation) => {
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
  date: {
    color: Colors.grey500,
    fontSize: '12px',
    float: 'right'
  },
  actionButton: {
    position: 'absolute',
    right: '16px',
    bottom: '16px'
  }
}

export default Chat
