import React from 'react'
import _ from 'lodash'

export default React.createClass({

  getStyles() {
    return {
      flex: 1,
      overflowY: 'auto'
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
