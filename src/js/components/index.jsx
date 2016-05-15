import React from 'react'

export default React.createClass({
  contextTypes: {
    history: React.PropTypes.any,
    username: React.PropTypes.string
  },

  componentWillMount() {
    if (this.context.username) {
      this.context.history.pushState(null, '/graph')
    } else {
      this.context.history.pushState(null, '/login')
    }
  },

  render: function() {
    return <div></div>
  }

})
