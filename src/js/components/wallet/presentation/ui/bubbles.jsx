import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'
import Bubble from './bubble-item'

const STYLES = {
  bubbleEUR: {
    fontSize: 6
  },
  bubbleCRYPT: {
    fontSize: 2.5
  }
}

@Radium
export default class Bubbles extends React.Component {
  static propTypes = {
    ethBalance: PropTypes.string
  }

  render() {
    return (<div>
      <Bubble style={STYLES.bubbleEUR} unit="EUR"
        amount="5" x="10" y="14" />
      <svg height="150" width="14">
        <line x1="0" y1="80" x2="14" y2="80"
          style={{stroke: '#9ba0aa', strokeWidth: 3}} />
        <line x1="0" y1="70" x2="14" y2="70"
          style={{stroke: '#9ba0aa', strokeWidth: 3}} />
      </svg>
      <Bubble style={STYLES.bubbleCRYPT} unit="ETH"
        amount={this.props.ethBalance} x="4" y="13" />
    </div>)
  }
}
