import * as React from 'react'
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { Button } from 'react-native-material-ui'
import { Container, Header } from '../../structure'
import { JolocomTheme } from '../../../styles/jolocom-theme'

export interface ComponentState {
  password: any;
  confirmPassword: any;
}

export interface Props {
  clickNext: () => void;
}

export class PasswordEntryComponent extends React.Component<Props, ComponentState> {

  constructor(props: Props) {
    super(props)
    this.state = {
      password: '',
      confirmPassword: ''
    }
  }

  passwordValidityCheck(password : string) {
    if (password.indexOf(' ') !== -1) {
      return 'No spaces allowed'
    }
    if (!password.match((/[A-Z]/))) {
      return 'At least one uppercase letter needed'
    }
    if (!password.match((/[0-9]/))) {
      return 'At least one number needed'
    }
    return ''
  }

  handleOnConfirm = () => {
    let newState = {
      ...this.state,
      password: '',
      confirmPassword: ''
    }
    this.setState(newState)
    this.props.clickNext()
  }


  render() {
    const { password, confirmPassword } = this.state

    return (
      <Container>
        <View style={styles.infoContainer}>
          <Header title={'Please enter a secure password'} />
          <Text>The password is used to encrypt and protect your data</Text>
          <Text>Please use at least 8 characters,
          no spaces, at least one uppercase letter and one number.</Text>
        </View>
        <KeyboardAvoidingView
          style={styles.inputContainer}
          behavior={Platform.OS === 'ios' ? "padding" : undefined}>
          <TextInput
            style={styles.textInputField}
            placeholder={'Insert password'}
            maxLength={40}
            editable={true}
            secureTextEntry={true}
            keyboardType={'default'}
            onChangeText={ (password) => this.setState({password})} />
          <Text style={styles.textErrorField}>
            {
              password.length > 5 ?
              this.passwordValidityCheck(password) :
              null
            }
          </Text>
          <TextInput
            style={styles.textInputField}
            placeholder={'Confirm password'}
            maxLength={40}
            editable={true}
            secureTextEntry={true}
            keyboardType={'default'}
            onChangeText={
              (confirmPassword) => this.setState({confirmPassword})
            } />
          <Text style={styles.textErrorField}>
            {
              confirmPassword.length > 5 && password !== confirmPassword ?
              'Passwords do not match' :
              null
            }
          </Text>
        </KeyboardAvoidingView>
        <View style={styles.buttonContainer}>
          <Button
            onPress={this.handleOnConfirm}
            raised
            primary
            disabled={
              password === confirmPassword && password.length > 7 ?
              false :
              true
            }
            text="Continue" />
        </View>
      </Container>
    )
  }
}


const styles = StyleSheet.create({
  textInputField: {
    width: '80%',
    padding: '5%'
  },
  textErrorField: {
    color: 'red'
  },
  infoContainer: {
    height: '30%'
  },
  inputContainer: {
    marginTop: '3%',
    height: '35%',
    width: '100%',
    alignItems: 'center'
  },
  buttonContainer: {
    height: '20%'
  }
})
