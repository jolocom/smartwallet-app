import React from 'react'
import Radium from 'radium'

import {Styles} from 'material-ui'

let {Colors} = Styles

let Layout = React.createClass({

  getStyles() {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: Colors.white
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
