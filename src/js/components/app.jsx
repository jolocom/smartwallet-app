import React from 'react'

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
      </div>
    )
  }

})

export default App
