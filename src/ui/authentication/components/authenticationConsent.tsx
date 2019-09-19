import React from 'react'
import { ButtonSection } from 'src/ui/structure/buttonSectionBottom'
import { Text, StyleSheet, View } from 'react-native'
import I18n from 'src/locales/i18n'
import { StateAuthenticationRequestSummary } from 'src/reducers/sso'
import strings from '../../../locales/strings'
import { Colors, Typography, Spacing } from 'src/styles'
import { IssuerCard } from '../../documents/components/issuerCard'

interface Props {
  activeAuthenticationRequest: StateAuthenticationRequestSummary
  confirmAuthenticationRequest: Function
  cancelAuthenticationRequest: Function
}

interface State {}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLightMain,
  },
  topSection: {
    flex: 0.9,
  },
  issuerCard: {
    marginTop: Spacing.LG,
  },
  authRequestContainer: {
    flex: 1,
    paddingHorizontal: '10%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: Spacing.XL,
  },
  authRequestText: {
    ...Typography.baseFontStyles,
    ...Typography.centeredText,
    fontSize: Typography.textLG,
    marginTop: Spacing.SM,
  },
  buttonSection: {
    flex: 0.1,
  },
})

export class AuthenticationConsentComponent extends React.Component<
  Props,
  State
> {
  public state = {
    pending: false,
  }

  private handleConfirm = () => {
    this.setState({ pending: true })
    return this.props.confirmAuthenticationRequest()
  }

  public render() {
    const { requester, description } = this.props.activeAuthenticationRequest
    return (
      <View style={styles.container}>
        <View style={styles.topSection}>
          <IssuerCard issuer={requester} style={styles.issuerCard} />
          <View style={styles.authRequestContainer}>
            <Text style={styles.authRequestText}>
              {I18n.t(strings.WOULD_YOU_LIKE_TO)}
            </Text>
            <Text
              style={[styles.authRequestText, { fontSize: Typography.text4XL }]}
            >
              {description}
            </Text>
            <Text style={styles.authRequestText}>
              {I18n.t(strings.WITH_YOUR_SMARTWALLET)}
            </Text>
          </View>
        </View>
        <View style={styles.buttonSection}>
          <ButtonSection
            disabled={this.state.pending}
            denyDisabled={this.state.pending}
            confirmText={I18n.t(strings.AUTHORIZE)}
            denyText={I18n.t(strings.DENY)}
            handleConfirm={this.handleConfirm}
            handleDeny={() => this.props.cancelAuthenticationRequest()}
          />
        </View>
      </View>
    )
  }
}
