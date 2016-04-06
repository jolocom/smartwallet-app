import React from 'react'
import Radium from 'radium'

import ContactsList from 'components/contacts/list.jsx'

let Contacts = React.createClass({

  contextTypes: {
    history: React.PropTypes.any
  },

  showContact(username) {
    this.context.history.pushState(null, `/contacts/${username}`)
  },

  render() {
    return (
      <div style={styles.container}>
        <ContactsList onClick={this.showContact} searchQuery={this.props.searchQuery}/>
        {this.props.children}
      </div>
    )
  }

})

let styles = {
  container: {
    flex: 1,
    overflowY: 'auto'
  }
}

export default Radium(Contacts)
