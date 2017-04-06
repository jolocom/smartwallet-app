import React from 'react'
import Radium from 'radium'

@Radium
export default class Spacer extends React.Component {
  static propTypes = {
    children: React.PropTypes.node
  }

  getStyles() {
    return {
      flex: '1'
    }
  }

  render() {
    return (
      <div style={this.getStyles()}>
        {this.props.children}
      </div>
    )
  }
}
