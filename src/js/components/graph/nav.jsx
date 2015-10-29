import React from 'react'
// import Reflux from 'reflux'
import {IconButton} from 'react-mdl'

import SearchActions from 'actions/search'

import PinnedActions from 'actions/pinned'

export default React.createClass({

  contextTypes: {
    history: React.PropTypes.any
  },

  showSearch() {
    SearchActions.show()
  },

  showPinned() {
    PinnedActions.show()
  },

  render: function() {
    return (
      <nav className="mdl-navigation">
        <IconButton name="search" onClick={this.showSearch}/>
        <IconButton name="inbox" onClick={this.showPinned}></IconButton>
        <IconButton name="more_vert"></IconButton>
      </nav>
    )
  }
})
