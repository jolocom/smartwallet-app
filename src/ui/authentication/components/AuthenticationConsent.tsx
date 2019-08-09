import React from 'react'
import { ButtonSection } from 'src/ui/structure/buttonSectionBottom'
import { Text, StyleSheet, View } from 'react-native'
import I18n from 'src/locales/i18n'
import { StateAuthenticationRequestSummary } from 'src/reducers/sso'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import strings from '../../../locales/strings'
import { Colors, Typography, Spacing } from 'src/styles'

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
  requesterContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: Spacing.MD,
    marginTop: Spacing.LG,
  },
  requesterIcon: {
    backgroundColor: Colors.lightGrey,
    width: 40,
    height: 40,
  },
  requesterTextContainer: {
    flex: -1,
    marginLeft: Spacing.MD,
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
    return this.props.confirmAuthenticationRequest()
  }

  private renderRequesterCard(requester: string, callbackURL: string) {
    return (
      <View style={styles.requesterContainer}>
        <View style={styles.requesterIcon} />
        <View style={styles.requesterTextContainer}>
          <Text
            style={JolocomTheme.textStyles.light.textDisplayField}
            numberOfLines={1}
          >
            {requester}
          </Text>
          <Text
            style={JolocomTheme.textStyles.light.labelDisplayField}
            numberOfLines={1}
          >
            {callbackURL}
          </Text>
        </View>
      </View>
    )
  }

  private renderAuthRequest(description: string) {
    return (
      <View style={styles.authRequestContainer}>
        <Text style={styles.authRequestText}>
          {I18n.t(strings.WOULD_YOU_LIKE_TO)}
        </Text>
        <Text style={[styles.authRequestText, { fontSize: 42 }]}>
          {description}
        </Text>
        <Text style={styles.authRequestText}>
          {I18n.t(strings.WITH_YOUR_SMARTWALLET)}
        </Text>
      </View>
    )
  }

  private renderButtons() {
    return (
      <ButtonSection
        disabled={this.state.pending}
        denyDisabled={this.state.pending}
        confirmText={I18n.t(strings.AUTHORIZE)}
        denyText={I18n.t(strings.DENY)}
        handleConfirm={this.handleConfirm}
        handleDeny={() => this.props.cancelAuthenticationRequest()} // TODO Does this get dispatched correctly?
        verticalPadding={10}
      />
    )
  }

  render() {
    const {
      requester,
      callbackURL,
      description,
    } = this.props.activeAuthenticationRequest
    return (
      <View style={styles.container}>
        {this.renderRequesterCard(requester, callbackURL)}
        {this.renderAuthRequest(description)}
        {this.renderButtons()}
      </View>
    )
  }
}
