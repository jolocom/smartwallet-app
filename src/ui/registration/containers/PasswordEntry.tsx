import * as React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { registrationActions } from '../../../actions'
import { PasswordEntryComponent } from '../components/PasswordEntry'

export interface ReduxProps {
  savePassword: () => void;
}

export interface ComponentState {}

class passwordEntryContainer extends React.Component<ReduxProps> {
  static navigationOptions = { title: 'PasswordEntry', header: null }

  render() {
    return (
      <PasswordEntryComponent
        clickNext={this.props.savePassword}/>
    )
  }
}

const mapDispatchToProps = (dispatch : Function) => {
  return {
    savePassword: () => dispatch(registrationActions.savePassword())
  }
}

export const PasswordEntry = connect(null, mapDispatchToProps)(passwordEntryContainer)
