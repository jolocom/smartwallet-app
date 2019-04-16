import React from 'react'
// import { ButtonSection } from 'src/ui/structure/buttonSectionBottom'
import { Text, StyleSheet, View, Image } from 'react-native'
import I18n from 'src/locales/i18n'
// import { Block } from 'src/ui/structure'
import { StateAuthenticationRequestSummary } from 'src/reducers/sso'
import { JolocomTheme } from 'src/styles/jolocom-theme.ios'
import { Button } from 'react-native-material-ui'
const nameIcon = require('src/resources/svg/NameIcon.js')

interface Props {
  activeAuthenticationRequest: StateAuthenticationRequestSummary
  cancelAuthenticationRequest: () => void
  confirmAuthenticationRequest: () => void
}

interface State {}

const debug = {
  // borderColor: 'red',
  // borderWidth: 1,
}

const styles = StyleSheet.create({
  requester: {
    ...debug,
    flexDirection: 'row',
    backgroundColor: JolocomTheme.primaryColorWhite,
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginTop: 20,
  },
  requesterIconContainer: {
    ...debug,
  },
  requesterIcon: {
    backgroundColor: JolocomTheme.primaryColorGrey,
    width: 42,
    height: 42,
    color: JolocomTheme.primaryColorPurple,
  },
  requesterText: {
    ...debug,
    marginLeft: 16,
  },
  requestContainer: {
    ...debug,
    paddingHorizontal: '10%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestText: {
    ...JolocomTheme.textStyles.light.textDisplayField,
    textAlign: 'center',
    fontWeight: '300',
    marginTop: 10,
  },
  buttonContainer: {
    ...debug,
  },
})

export class AuthenticationConsentComponent extends React.Component<
  Props,
  State
> {
  state = {
    pending: false,
  }

  private handleConfirm = () => {
    this.setState({ pending: true })
    this.props.confirmAuthenticationRequest()
  }

  // private renderButtons() {
  //   return (
  //     <ButtonSection
  //       disabled={this.state.pending}
  //       confirmText={I18n.t('Confirm')}
  //       denyText={I18n.t('Deny')}
  //       handleConfirm={this.handleConfirm}
  //       handleDeny={() => this.props.cancelAuthenticationRequest()}
  //     />
  //   )
  // }

  private renderButtonsNew = () => {
    const buttonStyles = StyleSheet.create({
      buttonContainer: {
        borderTopWidth: 1,
        borderColor: 'rgb(236, 236, 236)',
        backgroundColor: JolocomTheme.primaryColorWhite,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 20,
      },
      confirmButton: {
        paddingHorizontal: 25,
        borderRadius: 4,
        backgroundColor: this.state.pending
          ? JolocomTheme.disabledButtonBackgroundGrey
          : JolocomTheme.primaryColorPurple,
      },
      confirmButtonText: {
        paddingVertical: 10,
        fontFamily: JolocomTheme.contentFontFamily,
        fontSize: JolocomTheme.headerFontSize,
        color: this.state.pending
          ? JolocomTheme.disabledButtonTextGrey
          : JolocomTheme.primaryColorSand,
        fontWeight: '100',
      },
      denyButton: {
        paddingHorizontal: 25,
      },
      denyButtonText: {
        paddingVertical: 10,
        fontFamily: JolocomTheme.contentFontFamily,
        fontSize: JolocomTheme.headerFontSize,
        color: JolocomTheme.primaryColorPurple,
        fontWeight: '100',
      },
    })
    return (
      <View style={buttonStyles.buttonContainer}>
        <Button
          onPress={() => this.props.cancelAuthenticationRequest()}
          text={I18n.t('Deny')}
          upperCase={false}
          style={{
            container: buttonStyles.denyButton,
            text: buttonStyles.denyButtonText,
          }}
        />
        <Button
          disabled={this.state.pending}
          onPress={this.handleConfirm}
          text={I18n.t('Confirm')}
          upperCase={false}
          style={{
            container: buttonStyles.confirmButton,
            text: buttonStyles.confirmButtonText,
          }}
        />
      </View>
    )
  }

  render() {
    const { did } = this.props.activeAuthenticationRequest
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.requester}>
          <View style={styles.requesterIconContainer}>
            <Image source={nameIcon} style={styles.requesterIcon} />
          </View>
          <View style={styles.requesterText}>
            <Text style={JolocomTheme.textStyles.light.textDisplayField}>
              Name of Service
            </Text>
            <Text style={JolocomTheme.textStyles.light.labelDisplayField}>
              demo-sso.jolocom.com
            </Text>
          </View>
        </View>
        <View style={styles.requestContainer}>
          <Text style={styles.requestText}>Do you want to</Text>
          <Text style={[styles.requestText, { fontSize: 42 }]}>
            [an action with 2 lines]
          </Text>
          <Text style={styles.requestText}>with your SmartWallet?</Text>
        </View>
        {this.renderButtonsNew()}
      </View>
    )
  }
}
