import * as React from 'react'
import { View, Text, Animated, StyleSheet, Image, Dimensions, ScrollView  } from 'react-native'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { registrationActions } from '../../../actions'

export interface ReduxProps {
}

export interface ComponentState {}

class passwordEntryContainer extends React.Component<ReduxProps> {

  render() {

    return (
      <View>
        <Text>Testing Password Entry</Text>
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch : Function) => {
  return {
  }
}

export const PasswordEntry = connect(null, mapDispatchToProps)(passwordEntryContainer)
