import React from 'react'
import Radium from 'radium'
import _ from 'lodash'

let Content = React.createClass({
  propTypes: {
    style: React.PropTypes.string,
    children: React.PropTypes.node
  },

  getStyles() {
    return {
      width: '100%',
      maxWidth: '1200px',
      margin: 'auto',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      backgroundColor: '#fff'
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
