import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'

@Radium
export default class Spacer extends React.Component {
  static propTypes = {
    children: PropTypes.node
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
