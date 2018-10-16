import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Container } from 'src/ui/structure'
import { DecoratedClaims } from 'src/reducers/account'
import { ClaimCard } from 'src/ui/sso/components/claimCard'
import { ReactNode } from 'react-redux'

interface Props {
  credentialToRender: DecoratedClaims
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5'
  }
})

export const CredentialDialogComponent: React.SFC<Props> = props => {
  return <Container style={StyleSheet.flatten(styles.container)}> 
    {renderFirstSection(props)}
    <ClaimCard containerStyle={{backgroundColor: 'white'}} primaryText={'Name of issuer'} secondaryText={props.credentialToRender.issuer} />
  </Container>
}

const renderFirstSection = (props: Props) : ReactNode => {
  return <View/>
}