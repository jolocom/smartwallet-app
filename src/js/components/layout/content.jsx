import React from 'react'
import Radium from 'radium'
import _ from 'lodash'

let Content = React.createClass({

  getStyles() {
    return {
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    }
  },

  render() {
    let styles = this.getStyles()

    let {style} = this.props

    if (style) {
      _.extend(styles, style)
    }

    return (
      <div style={styles}>
        {this.props.children}
      </div>
    )
  }

})

export default Radium(Content)
