import React from 'react'
import Reflux from 'reflux'
import Radium from 'radium'

import TimerMixin from 'react-timer-mixin'

import CommentsActions from 'actions/comments'
import CommentsStore from 'stores/comments'
import ProfileStore from 'stores/profile'

import {List, ListItem, Avatar} from 'material-ui'

import Compose from 'components/common/compose.jsx'

// @TODO we should subscribe to the gold ws server here
const CHAT_RELOAD_INTERVAL = 4000 // 4 seconds

let Comments = React.createClass({
  mixins: [
    Reflux.connect(CommentsStore, 'comments'),
    Reflux.connect(ProfileStore, 'profile'),
    TimerMixin
  ],

  componentDidMount: function() {
    this.setInterval(() => {
      CommentsActions.load(this.props.node)
    }, CHAT_RELOAD_INTERVAL)

    CommentsActions.load(this.props.node)
  },

  addComment: function(content) {
    CommentsActions.create({
      subject: this.props.node.uri,
      author: this.state.profile.webid,
      content: content
    })
  },

  getStyles() {
    return {
      container: {
        display: 'flex',
        flexDirection: 'column'
      },
      list: {
        flex: 1
      },
      compose: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%'
      }
    }
  },

  render: function() {
    let {style} = this.props
    let styles = this.getStyles()

    return (
      <div style={[styles.container, style]}>
        <List style={styles.list}>
          {this.state.comments.items.map(function({author, content}) {
            let avatar = <Avatar src={author.imgUri}>{author[0]}</Avatar>
            return (
              <ListItem primaryText={author} secondaryText={content} leftAvatar={avatar}/>
            )
          })}
        </List>
        <Compose placeholder="Write a comment..." onSubmit={this.addComment} style={styles.compose}/>
      </div>
    )
  }
})

export default Radium(Comments)
