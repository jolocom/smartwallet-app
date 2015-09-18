import React from 'react'
import mui from 'material-ui'
import { RouteHandler } from 'react-router'

import Nav from 'components/nav/nav.jsx'

// Get mui Components
let ThemeManager = new mui.Styles.ThemeManager()

let App = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  contextTypes: {
    router: React.PropTypes.func
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  },

  render() {

    return (
      <div id="page">

        <Nav />

        <section className="content">
          <RouteHandler />
        </section>

      </div>
    )
  }

})

export default App
