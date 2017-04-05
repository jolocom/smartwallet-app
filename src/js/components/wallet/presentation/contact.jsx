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
    setInformation: React.PropTypes.func.isRequired,
    deleteInformation: React.PropTypes.func.isRequired
  }

  render() {
    return (
      <div>
        <div onClick={this.props.action}>
        getAccountInformation
        </div>
        <div onClick={() => this.props.setInformation('emails', '0',
          {adress: 'qwee'})}>
        setEmail
        </div>
        <div onClick={() => this.props.deleteInformation('emails', '0')}>
        deleteEmail
        </div>
      </div>
    )
  }
}
