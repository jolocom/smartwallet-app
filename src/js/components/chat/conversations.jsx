import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'

import moment from 'moment'

import {
  List,
  ListItem,
  Avatar
} from 'material-ui'
import {grey500} from 'material-ui/styles/colors'

import TimerMixin from 'react-timer-mixin'

import AvatarList from 'components/common/avatar-list.jsx'

import ConversationsActions from 'actions/conversations'
import ConversationsStore from 'stores/conversations'
import Utils from 'lib/util'

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
  
  getStyles() {
    return {
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
      actionButton: {
        position: 'absolute',
        right: '16px',
        bottom: '16px'
      }
    }
  },

  render: function() {
    let content
    
    let styles = this.getStyles()
    
    let {loading, items} = this.state.conversations
    items = items || []
    items = items
      .filter(conv => conv.lastMessage !== null)
      .map(
        (item) => Object.assign({},
                                item,
                                {name: item.otherPerson.name || 'Unnamed',
                                 imgUri: item.otherPerson.img,
                                 secondaryText: item.lastMessage.content,
                                 rightText: moment(item.lastMessage.created).fromNow(),
                                 onTouchTap: this.showConversation
                                })
      )
      .sort(
        (itemA, itemB) =>
          itemA.lastMessage.created.getTime() < itemB.lastMessage.created.getTime()
      )
    
    return (
      <div style={styles.container}>

        <div style={styles.content}>
         {
            loading
            ? <Loading style={styles.loading} />
            : <AvatarList
                items={items}
                avatarLeft
                noHeadings
                noReordering
                emptyMessage={'No conversations'}
              />
          }
        </div>

        {this.props.children}
      </div>
    )
  }
})

export default Radium(Conversations)
