import React from 'react'
import { connect } from 'react-redux'
import { Keyboard, EmitterSubscription } from 'react-native'
import { registrationActions } from 'src/actions'
import { PasswordEntryComponent } from 'src/ui/registration/components/passwordEntry'
import { JolocomTheme } from 'src/styles/jolocom-theme'

interface ConnectProps {
  savePassword: (password: string) => void
}

interface Props extends ConnectProps {}

interface State {
  password: string
  confirmPassword: string
  keyboardDrawn: boolean
  lineColorPassword: string
  lineColorRepeat: string
}

export class PasswordEntryContainer extends React.Component<Props, State> {
  private kbShowListener!: EmitterSubscription
  private kbHideListener!: EmitterSubscription

  state = {
    password: '',
    confirmPassword: '',
    keyboardDrawn: false,
    lineColorPassword: JolocomTheme.primaryColorSand,
    lineColorRepeat: JolocomTheme.primaryColorSand,
  }

  componentDidMount() {
    this.setupListeners()
  }
  componentWillUnmount() {
    this.removeListeners()
  }

  private setupListeners(): void {
    this.kbShowListener = Keyboard.addListener('keyboardDidShow', () =>
      this.setState({ keyboardDrawn: true }),
    )

    this.kbHideListener = Keyboard.addListener('keyboardDidHide', () =>
      this.setState({ keyboardDrawn: false }),
    )
  }

  private removeListeners(): void {
    this.kbShowListener.remove()
    this.kbHideListener.remove()
  }

  private handleOnConfirm = (): void => {
    Keyboard.dismiss()
    this.props.savePassword(this.state.password)
  }

  private onPasswordChange = (password: string): void => {
    this.setState({ password })
  }

  private onFocusRepeat = (): void => {
    this.setState({
      lineColorRepeat: JolocomTheme.primaryColorPurple,
    })
  }

  private onFocusPassword = (): void => {
    this.setState({
      lineColorPassword: JolocomTheme.primaryColorPurple,
    })
  }

  private onBlurRepeat = (): void => {
    this.setState({
      lineColorRepeat: JolocomTheme.primaryColorSand,
    })
  }

  private onBlurPassword = (): void => {
    this.setState({
      lineColorPassword: JolocomTheme.primaryColorSand,
    })
  }

  private onPasswordConfirmChange = (confirmPassword: string): void => {
    this.setState({ confirmPassword })
  }

  render() {
    return (
      <PasswordEntryComponent
        onPasswordChange={this.onPasswordChange}
        onPasswordConfirmChange={this.onPasswordConfirmChange}
        password={this.state.password}
        confirmPassword={this.state.confirmPassword}
        keyboardDrawn={this.state.keyboardDrawn}
        clickNext={this.handleOnConfirm}
        onFocusRepeat={this.onFocusRepeat}
        onBlurRepeat={this.onBlurRepeat}
        onFocusPassword={this.onFocusPassword}
        onBlurPassword={this.onBlurPassword}
        lineColorPassword={this.state.lineColorPassword}
        lineColorRepeat={this.state.lineColorRepeat}
      />
    )
  }
}

const mapDispatchToProps = (dispatch: Function) => ({
  savePassword: (password: string) => {
    dispatch(registrationActions.savePassword(password))
  },
})

export const PasswordEntry = connect(
  null,
  mapDispatchToProps,
)(PasswordEntryContainer)
