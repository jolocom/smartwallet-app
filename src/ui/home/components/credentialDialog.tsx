import React from 'react'
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { Container, Block } from 'src/ui/structure'
import { DecoratedClaims } from 'src/reducers/account'
import { ClaimCard } from 'src/ui/sso/components/claimCard'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { prepareLabel } from 'src/lib/util'
import { CredentialTopCard } from './credentialTopCard'
import I18n from 'src/locales/i18n'

interface Props {
  credentialToRender: DecoratedClaims
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    backgroundColor: JolocomTheme.secondaryColorGrey,
    padding: 0,
  } as ViewStyle,
  claimCard: {
    paddingLeft: '15%',
    backgroundColor: JolocomTheme.primaryColorWhite,
  } as ViewStyle,
  sectionHeader: {
    height: 26,
    fontSize: 17,
    fontFamily: JolocomTheme.contentFontFamily,
    alignSelf: 'flex-start',
  } as TextStyle,
  primaryTextStyle: {
    fontSize: JolocomTheme.textStyles.light.labelDisplayField.fontSize,
    color: JolocomTheme.primaryColorPurple,
  } as TextStyle,
  secondaryTextStyle: {
    opacity: 1,
    fontSize: JolocomTheme.headerFontSize,
  } as TextStyle,
})

export const CredentialDialogComponent: React.SFC<Props> = props => {
  const {
    primaryTextStyle,
    secondaryTextStyle,
    sectionHeader,
    claimCard,
    container,
  } = styles
  const { credentialToRender } = props
  const { expires, credentialType, issuer } = credentialToRender

  return (
    <Container style={container}>
      <View style={{ padding: '5%', flex: 0.3, width: '95%' }}>
        <CredentialTopCard
          credentialName={credentialType}
          expiryDate={expires}
        />
      </View>
      <Block flex={0.2}>
        <Text style={sectionHeader}> Issued by </Text>
        <ClaimCard
          containerStyle={{
            ...StyleSheet.flatten(claimCard),
            paddingVertical: 5,
          }}
          primaryTextStyle={primaryTextStyle}
          secondaryTextStyle={secondaryTextStyle}
          primaryText={`${issuer.substring(0, 30)}...`}
          secondaryText={I18n.t('Name of issuer')}
        />
      </Block>

      <Block flex={0.45}>
        <Text style={{ ...StyleSheet.flatten(sectionHeader), marginTop: '5%' }}>
          {I18n.t('Document details/claims')}
        </Text>
        <ScrollView style={{ width: '100%' }}>
          {renderClaims(credentialToRender)}
        </ScrollView>
      </Block>

      <View flex={0.05} />
    </Container>
  )
}

const renderClaims = (toRender: DecoratedClaims) => {
  const { claimData } = toRender
  return Object.keys(claimData).map(field => (
    <View style={{ marginBottom: 1 }}>
      <ClaimCard
        key={claimData[field]}
        containerStyle={{
          ...StyleSheet.flatten(styles.claimCard),
          paddingVertical: 5,
        }}
        primaryText={claimData[field]}
        secondaryText={prepareLabel(field)}
      />
    </View>
  ))
}
