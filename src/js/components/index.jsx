import React from 'react'

export default React.createClass({
  contextTypes: {
    history: React.PropTypes.any
  },

  componentWillMount() {
    if (localStorage.getItem('fake-user')) {
      this.context.history.pushState(null, '/graph')
    } else {
      this.context.history.pushState(null, '/signup')
    }
  },

  render: function() {
    return <div></div>
  }

})
