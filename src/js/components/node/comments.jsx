import React from 'react'
import Reflux from 'reflux'

import TimerMixin from 'react-timer-mixin'

import CommentsActions from 'actions/comments'
import CommentsStore from 'stores/comments'
import ProfileStore from 'stores/profile'

import List, {ListItem} from 'components/common/list.jsx'

import Compose from 'components/common/compose.jsx'

// @TODO we should subscribe to the gold ws server here
const CHAT_RELOAD_INTERVAL = 4000 // 4 seconds

export default React.createClass({
  mixins: [
    Reflux.connect(CommentsStore),
    Reflux.connect(ProfileStore, 'profile'),
    React.addons.LinkedStateMixin,
    TimerMixin
  ],

  componentDidMount: function() {
    this.setInterval(() => {
      console.log('tick...')
      CommentsActions.load(this.props.node)
    }, CHAT_RELOAD_INTERVAL)

    CommentsActions.load(this.props.node)
  },

  addComment: function(content) {
    CommentsActions.create({
      subject: this.props.node,
      author: this.state.profile.webid,
      content: content
    })
  },

  render: function() {
    return (
      <div className="jlc-comments">
        <List className="jlc-comments-list">
          {this.state.comments.map(function({author, content}) {
            return (
              <ListItem title={author} content={content}/>
            )
          })}
        </List>
        <Compose placeholder="Write a comment..." onSubmit={this.addComment} className="jlc-compose-comment"/>
      </div>
    )
  }
})
