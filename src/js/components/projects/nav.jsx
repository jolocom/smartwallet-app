import React from 'react'
// import Reflux from 'reflux'
import {IconButton} from 'material-ui'

let ChatNav = React.createClass({
  render: function() {
    return (
      <nav>
        <IconButton iconClassName="material-ui">search</IconButton>
      </nav>
    )
  }
})

export default ChatNav
