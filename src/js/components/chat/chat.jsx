import React from 'react'
import Reflux from 'reflux'

import moment from 'moment'

import FabMenu from 'components/common/fab-menu.jsx'
import FabMenuItem from 'components/common/fab-menu-item.jsx'

import {List, ListItem, Avatar, Styles} from 'material-ui'

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
    history: React.PropTypes.any
  },

  componentDidMount() {
    ConversationsActions.load()
  },

  showConversation({username}) {
    this.context.history.pushState(null, `/chat/user/${username}`)
  },

  render: function() {
    return (
      <div className="jlc-chat">
        <List className="jlc-chat-list">
          {this.state.conversations.map((conversation) => {
            let {username} = conversation
            let {author, date, content} = conversation.items[0]
            let avatar = <Avatar src={author.imgUri}>{author.name[0]}</Avatar>
            date = moment(date).fromNow()
            return (
              <ListItem key={username} primaryText={
                <div>
                  <span>{author.name}</span>
                  <span style={styles.date}>{date}</span>
                </div>
              } secondaryText={content} leftAvatar={avatar} onClick={() => this.showConversation(conversation)}/>
            )
          })}
        </List>
        <FabMenu>
          <FabMenuItem icon="chat" label="Conversation" href="#/chat/new"/>
          <FabMenuItem icon="group_add" label="Group chat"/>
        </FabMenu>

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
  }
}

export default Chat
