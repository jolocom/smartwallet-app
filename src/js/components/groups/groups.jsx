import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'

import AvatarList from 'components/common/avatar-list.jsx'

import GroupsActions from 'actions/groups'
import GroupsStore from 'stores/groups'

import {FloatingActionButton, FontIcon} from 'material-ui'

import Debug from 'lib/debug'
let debug = Debug('components:groups')

let Groups = React.createClass({

  mixins: [
    Reflux.connect(GroupsStore, 'groups')
  ],
  contextTypes: {
    router: React.PropTypes.any
  },

  createChat(webId) {
    ChatActions.create(
        AccountStore.state.webId, AccountStore.state.webId, webId
    )
  },
  
  componentDidMount() {
    GroupsActions.load(this.props.searchQuery)
  },
  
  componentDidUpdate() {
    if (this.state.conversation && this.state.conversation.id) {
      debug('componentDidUpdate; ' +
        'redirection to conversation URL, with state', this.state)
      this.context.router.push(
        `/conversations/${this.state.conversation.id}`
      )
    }
  },
  
  getStyles() {
    return {
      actionButton: {
        position: 'absolute',
        right: '16px',
        bottom: '16px'
      }
    }
  },
  
  render() {
    
    let styles = this.getStyles()
    
    return (
      <div style={styles.container}>
        <AvatarList onClick={this.createChat}
          searchQuery={this.props.searchQuery}
          items={this.state.groups.items}
          emptyMessage={"No groups"}
          checkboxes
          />
          
        {this.props.children}
        
        <FloatingActionButton
          secondary
          href="#/groups/new"
          linkButton={true}
          style={styles.actionButton}
        >
          <FontIcon className="material-icons">add</FontIcon>
        </FloatingActionButton>
      </div>
    )
  }
})

let styles = {
  container: {
    flex: 1,
    overflowY: 'auto',
    position: 'relative'
  }
}

export default Radium(Groups)
