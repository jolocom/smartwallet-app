import React from 'react'
import { IdentityComponent } from 'src/ui/home/components/identity'
import { connect } from 'react-redux'
import { RootState } from 'src/reducers/'

interface ConnectProps { }

interface Props extends ConnectProps {}

interface State {
  userName: string,
  phoneNumber: string,
  emailAddress: string,
  scanning: boolean
}

export class IdentityContainer extends React.Component<Props, State> {

  state = {
    userName: '',
    phoneNumber: '',
    emailAddress: '',
    scanning: false
  }

  componentDidMount() {
  }
  private onUserNameChange= (userName: string) : void => {
    this.setState({ userName })
  }

  private onPhoneNumberChange= (phoneNumber: string) : void => {
    this.setState({ phoneNumber })
  }

  private onEmailAddressChange= (emailAddress: string) : void => {
    this.setState({ emailAddress })
  }

  private onScannerStart = () : void => {
    this.setState({ scanning: true })
  }

  private onScannerCancel = () : void => {
    this.setState({ scanning: false })
  }

  // TODO Typings on E, event is not enough
  private onScannerSuccess = (e : Event) : void => {
    this.setState({ scanning: false })
  }

  render() {
    return (
    <IdentityComponent
      scanning={ this.state.scanning }
      userName= {this.state.userName}
      phoneNumber= { this.state.phoneNumber }
      emailAddress= { this.state.emailAddress }
      onUserNameChange= { this.onUserNameChange }
      onPhoneNumberChange= { this.onPhoneNumberChange }
      onEmailAddressChange= { this.onEmailAddressChange }
      onScannerStart={ this.onScannerStart }
      onScannerSuccess={ this.onScannerSuccess }
      onScannerCancel={ this.onScannerCancel }
     />
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
  }
}

const mapDispatchToProps = (dispatch: (action: Function) => void) => {
  return {
  }
}

export const Identity = connect(mapStateToProps, mapDispatchToProps)(IdentityContainer)
