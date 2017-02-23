import React from 'react'
import Radium from 'radium'
import Reflux from 'reflux'
import { connect } from 'redux/utils'

import ContactsList from 'components/contacts/list.jsx'
import ChatActions from 'actions/chat'

import ChatStore from 'stores/chat'

import Debug from 'lib/debug'
let debug = Debug('components:contacts')

let Contacts = React.createClass({

  mixins: [
    Reflux.connect(ChatStore, 'conversation')
  ],
  contextTypes: {
    router: React.PropTypes.any
  },
  propTypes: {
    account: React.PropTypes.object
  },

  createChat(webId) {
    ChatActions.create(
      this.props.account.webId, this.props.account.webId, webId
    )
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
  render() {
    return (
      <div style={styles.container}>
        <ContactsList onClick={this.createChat}
          searchQuery={this.props.searchQuery} />
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

export default connect({
  props: ['account']
})(Radium(Contacts))
