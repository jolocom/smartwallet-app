import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
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
  subHeader: {
    fontSize: 14,
    color: JolocomTheme.textStyles.subheadline.color,
  },
  infoPassword: {
    fontSize: 12,
    color: JolocomTheme.textStyles.labelInputFields.color
  },
  textInputField: {
    width: '80%'
  },
  textErrorField: {
    color: 'red',
    fontSize: 14
  },
  mainContainer: {
    justifyContent: 'space-between'
  },
  nestedContainer: {
    justifyContent: 'space-around'
  },
  buttonContainer: {
    backgroundColor: JolocomTheme.palette.primaryColor
  }
})

export class IdentityComponent extends React.Component<Props, State> {


  render() {
    return (
      <Container>
        <TextInput
          style={ styles.textInputField }
          placeholder='Please enter your name'
          onChangeText={ this.props.onUserNameChange }
        />
        <TextInput
          style={ styles.textInputField }
          placeholder='Please enter your phone number'
          onChangeText={ this.props.onPhoneNumberChange}
        />
        <TextInput
          style={ styles.textInputField }
          placeholder='Please enter your email address'
          onChangeText={ this.props.onEmailAddressChange}
        />
      </Container>
    )
  }
}