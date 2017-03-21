import {RaisedButton} from 'material-ui'
import Transitions from 'material-ui/styles/transitions'
import React from 'react'
import Radium from 'radium'

@Radium
export default class HoverButton extends React.Component {
  static propTypes = {
    backgroundColor: React.PropTypes.string.isRequired,
    hoverColor: React.PropTypes.string.isRequired,
    style: React.PropTypes.Object,
    onClick: React.PropTypes.func.isRequired,
    children: React.PropTypes.node
  }

  render () {
    const transition = `background-color 450ms
    ${Transitions.easeOutFunction} 0ms`
    return <div style={{ display: 'inline-block' }}>
      <style>
        {`
        #hoverbutton:hover {
          transition: ${transition} !important;
          background-color: ${this.props.hoverColor} !important;
          color: ${this.props.backgroundColor} !important;
        }

        `}
      </style>
      <RaisedButton
        id="hoverbutton"
        backgroundColor={this.props.backgroundColor}
        style={this.props.style}
        onClick={this.props.onClick}>
        {this.props.children}
      </RaisedButton>
    </div>
}
}
