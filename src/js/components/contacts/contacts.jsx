import React from 'react'

import ContactsList from 'components/contacts/list.jsx'

export default React.createClass({

  contextTypes: {
    history: React.PropTypes.any
  },

  showContact(username) {
    this.context.history.pushState(null, `/contacts/${username}`)
  },

  render() {
    return (
      <div className="jlc-contacts">
        <ContactsList onClick={this.showContact} searchQuery={this.props.searchQuery}/>
        {this.props.children}
      </div>
    )
  }

})
