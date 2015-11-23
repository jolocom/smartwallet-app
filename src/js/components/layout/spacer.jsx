import React from 'react'

export default React.createClass({

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
