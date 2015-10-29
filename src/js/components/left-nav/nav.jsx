import React from 'react'
import ReactDOM from 'react-dom'
import Reflux from 'reflux'
// import {Link} from 'react-router'
import {Drawer} from 'react-mdl'

import Favourites from './favourites.jsx'

import NavStore from 'stores/nav'

import Header from './header.jsx'

let Nav = React.createClass({

  mixins: [Reflux.connect(NavStore)],

  contextTypes: {
    router: React.PropTypes.func
  },

  componentDidUpdate() {
    let action = this.state.show ? 'add' : 'remove'
    ReactDOM.findDOMNode(this.refs.drawer).classList[action]('is-visible')
  },

  render() {
    return (
      <Drawer ref="drawer">
        <Header/>
        <Favourites/>
      </Drawer>
    )
  }

})

export default Nav
