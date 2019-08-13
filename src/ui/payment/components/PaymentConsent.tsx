import React from 'react'
import { ButtonSection } from 'src/ui/structure/buttonSectionBottom'
import { View, Text, StyleSheet } from 'react-native'
import I18n from 'src/locales/i18n'
import { Container } from 'src/ui/structure'
import { getCredentialIconByType } from 'src/resources/util'
import { SectionClaimCard } from 'src/ui/structure/claimCard'
import { StatePaymentRequestSummary } from 'src/reducers/sso'
import { formatEth } from 'src/utils/formatEth'
import strings from '../../../locales/strings'
import { Colors, Typography, Spacing } from 'src/styles'

interface Props {
  activePaymentRequest: StatePaymentRequestSummary
  cancelPaymentRequest: () => void
  confirmPaymentRequest: () => void
}

interface State {}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    backgroundColor: Colors.backgroundLightMain,
  },
  priceContainer: {
    flex: 0.3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceAmount: {
    ...Typography.baseFontStyles,
    fontSize: Typography.textXXL,
    color: Colors.blackMain,
  },
  priceUnit: {
    ...Typography.baseFontStyles,
    marginLeft: Spacing.XS,
    fontSize: Typography.textMD,
  },
  cardContainer: {
    flex: 0.6,
  },
  buttonContainer: {
    flex: 0.1,
  },
})

export class PaymentConsentComponent extends React.Component<Props, State> {
  state = {
    pending: false,
  }

  private handleConfirm = () => {
    this.setState({ pending: true })
    this.props.confirmPaymentRequest()
  }

  private renderLeftIcon(type: string) {
    return getCredentialIconByType(type)
  }

  private renderTransactionDetails() {
    const {
      description,
      receiver: { did, address },
    } = this.props.activePaymentRequest
    return (
      <View style={styles.cardContainer}>
        <SectionClaimCard
          title={`${I18n.t(strings.FOR)}:`}
          primaryText={description}
          leftIcon={this.renderLeftIcon(I18n.t(strings.OTHER))}
        />
        <SectionClaimCard
          title={`${I18n.t(strings.TO)}:`}
          primaryText={`${did.substring(0, 17)}...`}
          secondaryText={`Eth address: ${address.substring(0, 13)}...`}
          leftIcon={this.renderLeftIcon('Email')}
        />
      </View>
    )
  }

  render() {
    const { amount } = this.props.activePaymentRequest
    const { formattedAmount, unit } = formatEth(amount)
    return (
      <Container style={styles.container}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceAmount}>{formattedAmount}</Text>
          <Text style={styles.priceUnit}>{unit}</Text>
        </View>
        {this.renderTransactionDetails()}
        <View style={styles.buttonContainer}>
          <ButtonSection
            disabled={this.state.pending}
            denyDisabled={this.state.pending}
            confirmText={I18n.t(strings.CONFIRM)}
            denyText={I18n.t(strings.DENY)}
            handleConfirm={this.handleConfirm}
            handleDeny={() => this.props.cancelPaymentRequest()}
          />
        </View>
      </Container>
    )
  }
}
