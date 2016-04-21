import React from 'react'
import {Drawer} from 'material-ui'

// import Favourites from './favourites.jsx'

import Header from './header.jsx'

let Nav = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  show() {
    this.refs.drawer.open()
  },

  render() {
    return (
      <Drawer ref="drawer" docked={false}>
        <Header/>
      </Drawer>
    )
  }

})

export default Nav
