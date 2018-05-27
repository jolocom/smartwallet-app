import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import { Container, Block } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { QRcodeScanner } from 'src/ui/home/components/qrcodeScanner'

// TODO Type for E, Event is not enough
interface Props {
  scanning: boolean,
  userName: string,
  phoneNumber: string,
  emailAddress: string,
  onUserNameChange: (input: string) => void
  onPhoneNumberChange: (input: string) => void
  onEmailAddressChange: (input: string) => void
  onScannerStart: () => void
  onScannerSuccess: (e : Event) => void
  onScannerCancel: () => void
}

interface State {
}

// TODO Magic numbers
const styles = StyleSheet.create({
  textInputField: {
    flex: 1,
    width: '80%'
  },
  block: {
    marginBottom: "15%"
  },
  icon: {
    margin: "20%"
  },
  iconContainer: {
    height: 55,
    width: 55,
    borderRadius: 35,
    backgroundColor: JolocomTheme.primaryColorBlack,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 8,
  },
  actionButtonContainer: {
    position: 'absolute',
    right: '3%',
    bottom: '5%',
    alignItems: 'flex-end'
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  }
})

// TODO SFC?
export class IdentityComponent extends React.Component<Props, State> {
  render() {
    let renderContent
    if (this.props.scanning) {
      renderContent = (
        <QRcodeScanner
          onScannerSuccess={this.props.onScannerSuccess}
          onScannerCancel={this.props.onScannerCancel}
        />
      )
    } else {
      renderContent = (
        <Block>
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
          <Block style={ styles.actionButtonContainer }>
            <TouchableOpacity
              style={ styles.iconContainer }
              onPress={ this.props.onScannerStart }>
              <Icon
                style={ styles.icon }
                size={ 30 }
                name="qrcode-scan"
                color="white"
              />
          </TouchableOpacity>
        </Block>
      </Block>
      )
    }

    return (
      <Container>
        {renderContent}
      </Container>
    )
  }
}
