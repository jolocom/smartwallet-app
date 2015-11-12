import React from 'react'

export default React.createClass({

  contextTypes: {
    history: React.PropTypes.any
  },

  componentWillMount() {
    this.history.pushState(null, '/signup')
  },

  render: function() {
    return <div></div>
  }

})
