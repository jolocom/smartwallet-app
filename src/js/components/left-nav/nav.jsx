import React from 'react'
import {LeftNav} from 'material-ui'

// import Favourites from './favourites.jsx'

import Header from './header.jsx'

let Nav = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  toggle() {
    this.refs.leftNav.toggle()
  },

  render() {
    return (
      <LeftNav ref="leftNav" header={<Header/>} docked={false}/>
    )
  }

})

export default Nav
