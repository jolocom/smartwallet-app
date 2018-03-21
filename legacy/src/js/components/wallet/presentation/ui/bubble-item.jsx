import PropTypes from 'prop-types';
import React from 'react'

class BubbleItem extends React.Component {
  static propTypes = {
    unit: PropTypes.string,
    amount: PropTypes.string,
    x: PropTypes.string,
    y: PropTypes.string
  }

  render() {
    const {style} = this.props || {}

    return (
      <svg height="145" width="145" viewBox="0 0 24 24">
        <g>
          <defs>
            <clipPath id="cut-off-left">
              <circle cx="12" cy="12" r="10" />
            </clipPath>
          </defs>
          <rect clipPath="url(#cut-off-left)" x="0" y="16"
            width="50" height="100" fill="#9ba0aa" />
          <rect clipPath="url(#cut-off-left)" x="0" y="0"
            width="50" height="16" fill="#c3c6cc" />
          <text fill="#f0f0f0" style={{fontSize: 4}}
            x="8" y="20">{this.props.unit}</text>
          <text fill="#f0f0f0" style={style} x={this.props.x}
            y={this.props.y}>{this.props.amount}</text>
        </g>
      </svg>
    )
  }
}

export default BubbleItem
