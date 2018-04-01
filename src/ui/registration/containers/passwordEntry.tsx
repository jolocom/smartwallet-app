import * as React from 'react'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { Keyboard, EmitterSubscription } from 'react-native'
import { registrationActions } from 'src/actions'
import { PasswordEntryComponent } from 'src/ui/registration/components/passwordEntry'

interface ConnectProps {
  savePassword: (password : string) => void
}

interface Props extends ConnectProps {}

interface State {
  password: string;
  confirmPassword: string;
  keyboardDrawn: boolean;
}

class passwordEntryContainer extends React.Component<ConnectProps, State> {
  private kbShowListener: EmitterSubscription;
  private kbHideListener: EmitterSubscription;

  constructor(props: Props) {
    super(props)
    this.state = {
      password: '',
      confirmPassword: '',
      keyboardDrawn: false
    }

    this.kbShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.handleKeyboardShow
    )
 
    this.kbHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.handleKeyboardHide
    )
  }

  componentWillUnmount() {
    this.kbShowListener.remove()
    this.kbHideListener.remove()
  }

  private handleKeyboardShow = () : void => {
    this.setState({ keyboardDrawn: true })
	}

  private handleKeyboardHide = () : void => {
    this.setState({ keyboardDrawn: false })
	}

  private handleOnConfirm = () : void => {
    Keyboard.dismiss()
    this.props.savePassword(this.state.password)
  }

  private onPasswordChange = (password: string) : void => {
    this.setState({ password })
  }

  private onPasswordConfirmChange = (confirmPassword: string) : void => {
    this.setState({ confirmPassword })
  }

  render() {
    return (
      <PasswordEntryComponent
        onPasswordChange={ this.onPasswordChange }
        onPasswordConfirmChange={ this.onPasswordConfirmChange }
        password={ this.state.password }
        confirmPassword={ this.state.confirmPassword }
        keyboardDrawn={ this.state.keyboardDrawn }
        clickNext={ this.handleOnConfirm }
      />
    )
  }
}

const mapDispatchToProps = (dispatch : Function ) => {
  return {
    savePassword: (password : string) => {
      dispatch(registrationActions.savePassword(password))
    }
  }
}

export const PasswordEntry = connect(
  null,
  mapDispatchToProps
)(passwordEntryContainer)
