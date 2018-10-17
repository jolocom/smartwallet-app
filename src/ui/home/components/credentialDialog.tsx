import React from 'react'
import { StyleSheet, Text, ScrollView, View } from 'react-native'
import { Container, Block } from 'src/ui/structure'
import { DecoratedClaims } from 'src/reducers/account'
import { ClaimCard } from 'src/ui/sso/components/claimCard'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { prepareLabel } from 'src/lib/util'
import { CredentialTopCard } from './credentialTopCard'

interface Props {
  credentialToRender: DecoratedClaims
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: 0
  },
  claimCard: {
    paddingLeft: '20%',
    backgroundColor: JolocomTheme.primaryColorWhite,
    paddingVertical: '5%'
  },
  sectionHeader: {
    marginTop: '5%',
    marginHorizontal: '5%',
    height: 26,
    fontSize: 17,
    fontFamily: JolocomTheme.contentFontFamily,
    alignSelf: 'flex-start'
  },
  scrollArea: {
    width: '100%'
  },
  primaryTextStyle: {
    fontSize: JolocomTheme.textStyles.light.fontSize,
    color: JolocomTheme.primaryColorPurple
  },
  secondaryTextStyle: {
    opacity: 1,
    fontSize: JolocomTheme.headerFontSize
  }
})

export const CredentialDialogComponent: React.SFC<Props> = props => {
  const { primaryTextStyle, secondaryTextStyle, sectionHeader, scrollArea } = styles
  const { credentialToRender } = props
  return (
    <Container style={StyleSheet.flatten(styles.container)}>
      <View style={{flex: 0.3, width: '100%', marginBottom: '5%'}}>
        <CredentialTopCard
          credentialName={props.credentialToRender.credentialType}
          expiryDate={props.credentialToRender.expires}
          />
      </View>
      <Block style={{flex: 0.2}}>
        <Text style={styles.sectionHeader}> Issued by </Text>
        <ClaimCard
          containerStyle={StyleSheet.flatten(styles.claimCard)}
          primaryTextStyle={StyleSheet.flatten(primaryTextStyle)}
          secondaryTextStyle={StyleSheet.flatten(secondaryTextStyle)}
          primaryText={`${credentialToRender.issuer.substring(0, 30)}...`}
          secondaryText={'Name of issuer'}
        />
      </Block>

      <Block flex={0.4}>
        <Text style={sectionHeader}> Document details/claims </Text>
        <ScrollView style={scrollArea}>{renderClaims(credentialToRender)}</ScrollView>
      </Block>

      <Block style={{flex: 0.1}}>{null}</Block>
    </Container>
  )
}

const renderClaims = (toRender: DecoratedClaims) => {
  const { claimData } = toRender
  return Object.keys(claimData).map(field => (
    <ClaimCard
      key={claimData[field]}
      containerStyle={{...StyleSheet.flatten(styles.claimCard), marginBottom: 1}}
      primaryText={claimData[field]}
      secondaryText={prepareLabel(field)}
    />
  ))
}
