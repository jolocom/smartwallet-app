import React from 'react'
import Reflux from 'reflux'
import {Link} from 'react-router'
import {Drawer, Navigation} from 'react-mdl'

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
    React.findDOMNode(this.refs.drawer).classList[action]('is-visible')
  },

  render() {
    return (
      <Drawer ref="drawer">
        <Header/>
        <section className="jlc-nav-section">
          <Navigation>
            <Link to="/graph" activeClassName="is-active"><i className="material-icons">share</i> Graph</Link>
            <Link to="/chat" activeClassName="is-active"><i className="material-icons">chat</i> Chat</Link>
            <Link to="/contacts" activeClassName="is-active"><i className="material-icons">contacts</i> Contacts</Link>
            <Link to="/projects" activeClassName="is-active"><i className="material-icons">folder</i> Projects</Link>
          </Navigation>
        </section>
        <Favourites/>
      </Drawer>
    )
  }

})

export default Nav
