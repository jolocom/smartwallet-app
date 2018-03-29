import * as React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { registrationActions } from 'src/actions'
import { PasswordEntryComponent } from 'src/ui/registration/components/PasswordEntry'

export interface ReduxProps {
  savePassword: (password : string) => void
}

export interface ComponentState {
  [x: string]: string
}

class passwordEntryContainer extends React.Component<ReduxProps, ComponentState> {
  constructor(props: ReduxProps) {
    super(props)
    this.state = {
      password: '',
      confirmPassword: ''
    }
  }

  handleOnConfirm = () => {
    console.log('handle on confirm: ', this.state)
    let newState = {
      ...this.state,
      password: '',
      confirmPassword: ''
    }
    this.setState(newState)
    this.props.savePassword(this.state.password)
  }

  handleTextInput = ({type, input} : {type : string, input : string}) => {
    this.setState({
      [type]: input
    })
  }

  render() {
    return (
      <PasswordEntryComponent
        handleTextInput={this.handleTextInput}
        password={this.state.password}
        confirmPassword={this.state.confirmPassword}
        clickNext={this.handleOnConfirm}/>
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
