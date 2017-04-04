import React from 'react'
import Radium from 'radium'

const STYLES = {
}

@Radium
export default class WalletContact extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    onSubmit: React.PropTypes.func.isRequired,
    action: React.PropTypes.func.isRequired,
    setInformation: React.PropTypes.func.isRequired
  }

  render() {
    return (
      <div>
        <div onClick={this.props.action}>
        contact
        </div>
        <div onClick={() => this.props.setInformation('emails', '0', 'qwee')}>
        setEmail
        </div>
      </div>
    )
  }
}
