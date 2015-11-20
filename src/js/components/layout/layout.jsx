import React from 'react'

import {Styles} from 'material-ui'

let {Colors} = Styles

export default React.createClass({

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
