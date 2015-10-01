import React from 'react'
import Reflux from 'reflux'
import {Link} from 'react-router'
import {Drawer, Navigation} from 'react-mdl'

import NavStore from 'stores/nav'

import Header from './header.jsx'

let Nav = React.createClass({

  mixins: [Reflux.listenTo(NavStore,'onToggle')],

  contextTypes: {
    router: React.PropTypes.func
  },

  _onLeftNavChange(e, key, payload) {
    this.context.router.transitionTo(payload.route)
  },

  render() {
    // let items = this._getItemsWithIcon()

    return (
      <Drawer className="jlc-nav">
        <Header/>
        <Navigation>
          <Link to="/graph" className="mdl-navigation__link" activeClassName="is-active"><i className="material-icons">share</i> Graph</Link>
          <Link to="/chat" className="mdl-navigation__link" activeClassName="is-active"><i className="material-icons">chat</i> Chat</Link>
        </Navigation>
      </Drawer>
    )
  },

  toggle: function() {
    this.refs.leftNav.toggle()
  }

})

export default Nav
