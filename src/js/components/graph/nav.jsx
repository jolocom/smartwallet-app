import React from 'react/addons'
// import Reflux from 'reflux'
import {IconButton} from 'react-mdl'

import SearchActions from 'actions/search'
import PinnedActions from 'actions/pinned'

let GraphNav = React.createClass({

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

export default GraphNav
