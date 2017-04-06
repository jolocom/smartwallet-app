import React from 'react'
import Radium from 'radium'

const STYLES = {
}

@Radium
export default class WalletContact extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    onSubmit: React.PropTypes.func.isRequired,
    getAccountInformation: React.PropTypes.func.isRequired,
    setInformation: React.PropTypes.func.isRequired,
    deleteInformation: React.PropTypes.func.isRequired,
    updateInformation: React.PropTypes.func.isRequired,
    information: React.PropTypes.object.isRequired
  }

  componentDidMount() {
    this.props.getAccountInformation()
  }

  render() {
    console.log(
      (this.props.information.originalInformation)
      ? this.props.information.originalInformation
      : null)
    return (
      <div>
        <div onClick={this.props.getAccountInformation}>
        getAccountInformation
        </div>
        <div onClick={() => this.props.setInformation('emails', '0',
          {adress: 'qwee'})}>
        setEmail
        </div>
        <div onClick={() => this.props.deleteInformation('emails', '0')}>
        deleteEmail
        </div>
        <div onClick={() => this.props.updateInformation('emails',
          '1', 'updated@example.com')}>
        updateEmail
        </div>
        <div>
          {
            // (this.props.information.originalInformation)
            // ? this.props.information.originalInformation.emails[0].address
            // : null
          }
        </div>
      </div>
    )
  }
}
