import React from 'react'
import { View } from 'react-native'
import { IdentityComponent } from 'src/ui/home/components/identity'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { accountActions } from 'src/actions'
import { RootState } from 'src/reducers/'

interface ConnectProps {
}

interface Props extends ConnectProps {}

interface State {
  userName: string,
  phoneNumber: string,
  emailAddress: string
}

export class IdentityContainer extends React.Component<Props, State> {

  state = {
    userName: '',
    phoneNumber: '',
    emailAddress: ''
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

  render() {
    return (
    <IdentityComponent
      userName= {this.state.userName}
      phoneNumber= { this.state.phoneNumber }
      emailAddress= { this.state.emailAddress }
      onUserNameChange= { this.onUserNameChange }
      onPhoneNumberChange= { this.onPhoneNumberChange }
      onEmailAddressChange= { this.onEmailAddressChange }
     />
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
  }
}

const mapDispatchToProps = (dispatch: (action: AnyAction) => void) => {
  return {}
}

export const Identity = connect(mapStateToProps, mapDispatchToProps)(IdentityContainer)
