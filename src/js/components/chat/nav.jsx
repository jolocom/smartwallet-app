import React from 'react'
// import Reflux from 'reflux'
import {IconButton} from 'react-mdl'

let ChatNav = React.createClass({
  render: function() {
    return (
      <nav className="mdl-navigation">
        <IconButton name="search"></IconButton>
      </nav>
    )
  }
})

export default ChatNav
