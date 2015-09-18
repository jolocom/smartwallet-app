import React from 'react'
import Reflux from 'reflux'
import {LeftNav} from 'material-ui'

import NavStore from 'stores/nav'

import Header from './header.jsx'

let menuItems = [
  { route: 'graph', text: 'Graph' },
  { route: 'chat', text: 'Chat' }
]

let Nav = React.createClass({

  mixins: [Reflux.listenTo(NavStore,'onToggle')],

  contextTypes: {
    router: React.PropTypes.func
  },

  onToggle() {
    this.toggle()
  },

  // Get the selected item in LeftMenu
  _getSelectedIndex() {
    let currentItem

    for (let i = menuItems.length - 1; i >= 0; i--) {
      currentItem = menuItems[i]
      if (currentItem.route && this.context.router.isActive(currentItem.route)) {
        return i
      }
    }
  },

  _onLeftNavChange(e, key, payload) {
    this.context.router.transitionTo(payload.route)
  },

  render() {

    return (
      <LeftNav
        ref="leftNav"
        docked={false}
        menuItems={menuItems}
        selectedIndex={this._getSelectedIndex()}
        onChange={this._onLeftNavChange}
        header={<Header/>} />
    )
  },

  toggle: function() {
    this.refs.leftNav.toggle()
  }

})

export default Nav
