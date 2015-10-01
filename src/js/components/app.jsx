import React from 'react'
import { RouteHandler } from 'react-router'

let App = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  render() {

    return (
      <div id="page">
        <section className="content">
          <RouteHandler />
        </section>
      </div>
    )
  }

})

export default App
