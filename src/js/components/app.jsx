import React from 'react'

import Profile from 'components/profile.jsx'

let App = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  render() {

    return (
      <div id="page">
        <section className="content">
          {this.props.children}
        </section>
        <Profile/>
      </div>
    )
  }

})

export default App
