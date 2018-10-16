import React from 'react'
import { StyleSheet, Text, TextStyle, ViewStyle, ScrollView, View } from 'react-native'
import { Container, Block } from 'src/ui/structure'
import { DecoratedClaims } from 'src/reducers/account'
import { ClaimCard } from 'src/ui/sso/components/claimCard'
import { CredentialCard } from './credentialCard'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { prepareLabel } from 'src/lib/util';

interface Props {
  credentialToRender: DecoratedClaims
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: 0
  } as ViewStyle,
  claimCard: {
    paddingLeft: '20%',
    backgroundColor: 'white',
    paddingVertical: '5%'
  },
  sectionHeader: {
    marginTop: '5%',
    marginHorizontal: '5%',
    height: 26,
    fontSize: 17,
    fontFamily: JolocomTheme.contentFontFamily,
    alignSelf: 'flex-start'
  } as TextStyle
})

export const CredentialDialogComponent: React.SFC<Props> = props => {
  return (
    <Container style={StyleSheet.flatten(styles.container)}>
    <View style={{flex: 0.4}}/>
      <Block flex={0.2}>
        <Text style={styles.sectionHeader}> Issued by </Text>
        <ClaimCard
          containerStyle={StyleSheet.flatten(styles.claimCard)}
          primaryTextStyle={{
            fontSize: 17,
            color: '#942f51'
          }}
          secondaryTextStyle={{
            opacity: 1,
            fontSize: 22
          }}
          primaryText={props.credentialToRender.issuer}
          secondaryText={'Name of issuer'}
        />
      </Block>

      <Block flex={0.4}>
        <Text style={styles.sectionHeader}> Document details/claims </Text>
        <ScrollView style={{width: '100%'}}>
          {renderClaims(props.credentialToRender)}
        </ScrollView>
      </Block>

      <Block flex={0.1}>{null}</Block>
    </Container>
  )
}

const renderClaims = (toRender: DecoratedClaims) => {
  const { claimData } = toRender
  return Object.keys(claimData).map(field => (
    <ClaimCard
      containerStyle={{ paddingLeft: '20%', paddingVertical: '3%', backgroundColor: 'white', marginBottom: 1 }}
      primaryText={claimData[field]}
      secondaryText={prepareLabel(field)}
    />
  ))
}
