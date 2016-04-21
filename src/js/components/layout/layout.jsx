import React from 'react'
import Radium from 'radium'

let Layout = React.createClass({

  contextTypes: {
    muiTheme: React.PropTypes.object.isRequired
  },

  getStyles() {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#fff'
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

export default Radium(Layout)
