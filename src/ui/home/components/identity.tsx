import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { Svg, Path } from 'react-native-svg'
import { Container, Block } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'

interface Props {
  userName: string,
  phoneNumber: string,
  emailAddress: string,
  onUserNameChange: (input: string) => void
  onPhoneNumberChange: (input: string) => void
  onEmailAddressChange: (input: string) => void
}

interface State {

}

const styles = StyleSheet.create({
  textInputField: {
    flex: 1,
    width: '80%'
  },
  block: {
    marginBottom: "15%"
  },
  icon: {
    marginLeft: "75%",
    marginBottom: "15%"
  }
})

export class IdentityComponent extends React.Component<Props, State> {


  render() {
    return (
      <Container>
        <Block style={ styles.block }>
          <TextInput
            style={ styles.textInputField }
            placeholder='Please enter your name'
            onChangeText={ this.props.onUserNameChange }
            value={ this.props.userName}
          />
          <TextInput
            style={ styles.textInputField }
            placeholder='Please enter your phone number'
            onChangeText={ this.props.onPhoneNumberChange}
            value={ this.props.phoneNumber}
          />
          <TextInput
            style={ styles.textInputField }
            placeholder='Please enter your email address'
            onChangeText={ this.props.onEmailAddressChange}
            value={ this.props.emailAddress}
          />
        </Block>
        <Icon
          style={ styles.icon }
          size={ 45 }
          name="qrcode-scan"
          color="black"
        />
      </Container>
    )
  }
}