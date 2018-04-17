import React from 'react'
import { View, Text } from 'react-native'

interface Props {
  // did: string
}

interface State {}

export class IdentityComponent extends React.Component<Props, State> {
  render() {
    return (
      <View>
        {/* <Text> {this.props.did} </Text> */}
        <Text> IDENTITY </Text>
      </View>
    )
  }
}