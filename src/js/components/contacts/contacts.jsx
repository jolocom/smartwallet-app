import React from 'react'
import Radium from 'radium'

import ContactsList from 'components/contacts/list.jsx'
import ChatActions from 'actions/chat'

import AccountStore from 'stores/account'

let Contacts = React.createClass({

  contextTypes: {
    history: React.PropTypes.any
  },

  createChat(webId) {
    console.log('createChat called with argument',webId)
    console.log("three params",AccountStore,AccountStore.state.webId,webId)
    ChatActions.create(
        AccountStore.state.webId, AccountStore.state.webId, webId
    )
  },
  render() {
    return (
      <div style={styles.container}>
        <ContactsList onClick={this.createChat} searchQuery={this.props.searchQuery} />
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
