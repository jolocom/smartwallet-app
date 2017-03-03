import React from 'react'
import Radium from 'radium'

import { connect } from 'redux/utils'

import ContactsList from 'components/contacts/list.jsx'
import ChatActions from 'actions/chat'

@Radium
export default class Contacts extends React.Component {
  static propTypes = {
    searchQuery: React.PropTypes.string,
    children: React.PropTypes.node,
    account: React.PropTypes.object
  }

  static contextTypes = {
    router: React.PropTypes.any,
    store: React.PropTypes.object
  }

  createChat(webId) {
    ChatActions.create(
      this.props.account.webId, this.props.account.webId, webId
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

export default connect({
  props: ['account']
})(Radium(Contacts))
