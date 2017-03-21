import {RaisedButton} from 'material-ui'
import Transitions from 'material-ui/styles/transitions'
import React from 'react'
import Radium from 'radium'

@Radium
export default class HoverButton extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    backgroundColor: React.PropTypes.string.isRequired,
    labelColor: React.PropTypes.string.isRequired,
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
        #${this.props.id}:hover {
          transition: ${transition} !important;
          background-color: ${this.props.labelColor} !important;
          color: ${this.props.backgroundColor} !important;
        }

        #${this.props.id} {
          transition: ${transition} !important;
          background-color: ${this.props.backgroundColor} !important;
          color: ${this.props.labelColor} !important;

        }
        `}
      </style>
      <RaisedButton
        id={this.props.id}
        backgroundColor={this.props.labelColor}
        labelColor={this.props.backgroundColor}
        style={this.props.style}
        onClick={this.props.onClick}>
        {this.props.children}
      </RaisedButton>
    </div>
}
}
