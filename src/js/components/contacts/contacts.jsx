import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'

import AvatarList from 'components/common/avatar-list.jsx'
import ChatActions from 'actions/chat'
import ContactsActions from 'actions/contacts'

import AccountStore from 'stores/account'

import ChatStore from 'stores/chat'
import ContactsStore from 'stores/contacts'

import Debug from 'lib/debug'
let debug = Debug('components:contacts')

let Contacts = React.createClass({

  mixins: [
    Reflux.connect(ChatStore, 'conversation'),
    Reflux.connect(ContactsStore, 'contacts')
  ],
  contextTypes: {
    router: React.PropTypes.any
  },
  propTypes: {
    searchQuery: React.PropTypes.string,
    children: React.PropTypes.object
  },
  createChat(webId) {
    ChatActions.create(
        AccountStore.state.webId, AccountStore.state.webId, webId
    )
  },

  componentDidMount() {
    ContactsActions.load(this.props.searchQuery)
  },

  componentDidUpdate() {
    debug('did update', this.state)
    if (this.state.conversation && this.state.conversation.id) {
      debug('componentDidUpdate; ' +
        'redirection to conversation URL, with state', this.state)
      this.context.router.push(
        `/conversations/${this.state.conversation.id}`
      )
    }
  },
  render() {
    let items = this.state.contacts.items.map(
      (item) => Object.assign(
        {},
        item,
        {secondaryText: item.email, id: item.email}
      )
    )

    return (
      <div style={styles.container}>
        <AvatarList onClick={this.createChat}
          searchQuery={this.props.searchQuery}
          items={items}
          emptyMessage={'No contacts'}
          />
        {this.props.children}
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

export default Radium(Contacts)
