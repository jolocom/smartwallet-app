import Transitions from 'material-ui/styles/transitions'
import React from 'react'
import Radium from 'radium'

@Radium
export default class HoverButton extends React.Component {
  static propTypes = {
    backgroundColor: React.PropTypes.string.isRequired,
    hoverColor: React.PropTypes.string.isRequired,
    style: React.PropTypes.any,
    onClick: React.PropTypes.func.isRequired,
    children: React.PropTypes.node
  }

  render () {
    const transition = `background-color 450ms
    ${Transitions.easeOutFunction} 0ms`
    const STYLES = {
      hoverbutton: {
        ':hover': {
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
