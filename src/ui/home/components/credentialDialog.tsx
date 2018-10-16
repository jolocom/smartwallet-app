import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Container } from 'src/ui/structure'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { DecoratedClaims } from 'src/reducers/account'
import { ClaimCard } from 'src/ui/sso/components/claimCard'
import { ReactNode } from 'react-redux'

interface Props {
  credentialToRender: DecoratedClaims
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5'
  },
  firstSection: {
    flex: 0.3,
    borderColor: JolocomTheme.secondaryColorSand,
    borderRadius: 2,
    backgroundColor: "purple"
  },
  firstSectionHeader: {
    fontSize: JolocomTheme.landingHeaderFontSize,
    color: JolocomTheme.primaryColorBlack
  },
  firstSectionSubheader: {
    fontSize: JolocomTheme.headerFontSize,
    color: JolocomTheme.secondaryColorGrey
  }
})

export const CredentialDialogComponent: React.SFC<Props> = props => {
  return <Container style={StyleSheet.flatten(styles.container)}> 
    {renderFirstSection(props)}
    <ClaimCard containerStyle={{backgroundColor: 'white'}} primaryText={'Name of issuer'} secondaryText={props.credentialToRender.issuer} />
  </Container>
}

const renderFirstSection = (props: Props) : ReactNode => {
  console.log(props, 'here are your props')
  return <View style={styles.firstSection}>
   <Text style={styles.firstSectionHeader}>{props.credentialToRender.credentialType}</Text>
   <Text style={styles.firstSectionSubheader}>{props.credentialToRender.id}</Text>
   {/* expiry date? */}
  </View>
}