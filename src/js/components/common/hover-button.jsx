import Transitions from 'material-ui/styles/transitions'
import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'

@Radium
export default class HoverButton extends React.Component {
  static propTypes = {
    backgroundColor: PropTypes.string.isRequired,
    hoverColor: PropTypes.string.isRequired,
    style: PropTypes.any,
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node
  }

  render () {
    const transition = `background-color 450ms
    ${Transitions.easeOutFunction} 0ms`
    const STYLES = {
      hoverbutton: {
        ':hover': {
          cursor: 'pointer',
          transition: transition,
          backgroundColor: this.props.hoverColor,
          color: this.props.backgroundColor
        }
      }
    }

    return (
      <div
        style={Object.assign(STYLES.hoverbutton, this.props.style)}
        onClick={this.props.onClick}>
        {this.props.children}
      </div>
    )
  }
}
