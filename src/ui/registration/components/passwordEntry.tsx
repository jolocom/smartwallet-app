import React from 'react'
import { StyleSheet, TextInput, } from 'react-native'
import { Button } from 'react-native-material-ui'
import { Container, Header, Block, CenteredText } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'

interface Props {
  keyboardDrawn: boolean;
  password: string;
  confirmPassword: string;
  onPasswordChange: (input:  string) => void;
  onPasswordConfirmChange: (input:  string) => void;
  clickNext: () => void;
}

const styles = StyleSheet.create({
  subHeader: {
    fontSize: 14,
    color: JolocomTheme.primaryColorBlack
  },
  infoPassword: {
    fontSize: 12,
    color: JolocomTheme.primaryColorBlack
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
    backgroundColor: JolocomTheme.primaryColorWhite
  }
})

export const PasswordEntryComponent : React.SFC<Props> = props => {
  const { password, confirmPassword, keyboardDrawn } = props
  const errorMsg = validateInput(password, confirmPassword)

  return (
    <Container style={ styles.mainContainer }>
      <Block style={ styles.nestedContainer } flex={ 0.4 }>
        <Header title={ keyboardDrawn ? '' : 'Please enter a secure password' }/>
        <CenteredText
          style={ styles.subHeader }
          msg={ keyboardDrawn ? '' : 'The password is used to encrypt and protect your data' }
        />
        <CenteredText
          style={ styles.infoPassword }
          msg={ 'Please use at least 8 characters, ' +
            'no spaces, at least one uppercase letter and one number.' }
        />
      </Block>
      <Block style={ styles.nestedContainer } flex={ 0.3 }>
        <TextInput
          style={ styles.textInputField }
          placeholder={ 'Insert password' }
          maxLength={ 40 }
          editable
          secureTextEntry
          keyboardType={ 'default' }
          onChangeText={ props.onPasswordChange }
        /> 
        <TextInput
          style={ styles.textInputField }
          placeholder={ 'Confirm password' }
          maxLength={ 40 }
          editable
          secureTextEntry
          keyboardType={ 'default' }
          onChangeText={ props.onPasswordConfirmChange }
        />
        <CenteredText
          style={ styles.textErrorField }
          msg={ password.length > 5 ? errorMsg : '' }
        />
      </Block>
      <Block flex={ 0.1 }>
        <Button
          style={ !errorMsg ? { container: styles.buttonContainer } : {} }
          onPress={ props.clickNext }
          raised
          primary
          disabled={ !!errorMsg }
          text="Continue"
        />
      </Block>
    </Container>
  )
}

const validateInput = (password: string, confirmPassword: string) : string => {
  if (password.indexOf(' ') !== -1) {
    return 'No spaces allowed'
  }

  if (!password.match((/[A-Z]/))) {
    return 'At least one uppercase letter needed'
  }

  if (!password.match((/[0-9]/))) {
    return 'At least one number needed'
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match'
  }

  if (password.length < 8) {
    return 'At least 8 characters are required'
  }

  return ''
}
