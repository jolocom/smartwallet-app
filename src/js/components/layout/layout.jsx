import React from 'react'

export default React.createClass({

  getStyles() {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
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
