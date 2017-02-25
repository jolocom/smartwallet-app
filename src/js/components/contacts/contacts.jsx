import React from 'react'
import Radium from 'radium'

import ContactsList from 'components/contacts/list.jsx'
import ChatActions from 'actions/chat'

import AccountStore from 'stores/account'

import ChatStore from 'stores/chat'

@Radium
export default class Contacts extends React.Component {
  static propTypes = {
    searchQuery: React.PropTypes.string,
    children: React.PropTypes.node
  }

  static contextTypes = {
    router: React.PropTypes.any
  }

  constructor() {
    super()

    this.store = ChatStore

    this.state = {

    }
  }

  createChat(webId) {
    ChatActions.create(
        AccountStore.state.webId, webId
    )
  }

  componentDidUpdate() {
    if (this.state.id) {
      this.context.router.push(
        `/conversations/${this.state.id}`
      )
    }
  }

  render() {
    return (
      <div style={styles.container}>
        <ContactsList
          onClick={this.createChat}
          searchQuery={this.props.searchQuery}
        />
        {this.props.children}
      </div>
    )
  }
}

let styles = {
  container: {
    flex: 1,
    overflowY: 'auto',
    position: 'relative'
  }
}
