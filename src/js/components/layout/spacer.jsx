import React from 'react'
import Radium from 'radium'

let Spacer = React.createClass({

  getStyles() {
    return {
      flex: '1'
    }
  },

  render() {
    return (
      <div style={this.getStyles()}>
        {this.props.children}
      </div>
    )
  }

})

export default Radium(Spacer)
