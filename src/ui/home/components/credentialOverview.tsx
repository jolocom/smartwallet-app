import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native'
import { Container, Block } from 'src/ui/structure'
import { CredentialCard } from './credentialCard'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { ReactNode } from 'react'
import { ClaimsState, CategorizedClaims } from 'src/reducers/account'
import { DecoratedClaims } from 'src/reducers/account/'
import { CredentialTypes } from 'src/lib/categories'
import { MoreIcon } from 'src/resources';
import { getCredentialIconByType } from 'src/resources/util'
const loaders = require('react-native-indicator')

interface Props {
  claimsState: ClaimsState
  scanning: boolean
  loading: boolean
  onScannerStart: () => void
  onEdit: (claim: DecoratedClaims) => void
  did: string
}

interface State {}

const styles = StyleSheet.create({
  qrCodeIconContainer: {
    height: 55,
    width: 55,
    borderRadius: 35,
    backgroundColor: JolocomTheme.primaryColorPurple,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 8
  },
  qrCodeButtonSection: {
    position: 'absolute',
    alignItems: 'flex-end',
    right: '3%',
    bottom: '5%'
  },
  sectionHeader: {
    marginTop: '5%',
    marginHorizontal: '5%',
    height: 26,
    fontSize: 17,
    fontFamily: JolocomTheme.contentFontFamily
  },
  scrollComponent: {
    width: '100%'
  },
  scrollComponentLoading: {
    flexGrow: 1,
    justifyContent: 'space-around'
  }
})

export class CredentialOverview extends React.Component<Props, State> {
  renderCredentialCard = (category: string): ReactNode => {
    const { onEdit, did, claimsState } = this.props

    const decoratedCredentials: CategorizedClaims = claimsState.decoratedCredentials
    const categorizedCredentials: DecoratedClaims[] = decoratedCredentials[category] || []

    return categorizedCredentials.map((claim: DecoratedClaims) => {
      const selfSigned = claim.issuer === did
      return <CredentialCard
        title={collapsible(claim) ? claim.credentialType : ''}
        handleInteraction={() => onEdit(claim)}
        credentialItem={claim}
        collapsible={collapsible(claim)}
        rightIcon={selfSigned ? <MoreIcon /> : null}
        leftIcon={getCredentialIconByType(claim.credentialType)}
      />
    })
  }

  renderCredentialCategory = (category: string) => [
    <Text style={styles.sectionHeader}>{category.toString()}</Text>,
    this.renderCredentialCard(category)
  ]

  render() {
    const { decoratedCredentials, loading } = this.props.claimsState
    const { qrCodeButtonSection, scrollComponent, scrollComponentLoading, qrCodeIconContainer } = styles

    const claimCategories = Object.keys(decoratedCredentials)

    if (loading) {
      return renderLoadingScreen()
    }

    return (
      <Container style={{ padding: 0 }}>
        <ScrollView style={scrollComponent} contentContainerStyle={loading ? scrollComponentLoading : {}}>
          {claimCategories.map(this.renderCredentialCategory)}
        </ScrollView>
        <Block style={StyleSheet.flatten(qrCodeButtonSection)}>
          <TouchableOpacity style={qrCodeIconContainer} onPress={this.props.onScannerStart}>
            <Icon size={30} name="qrcode-scan" color="white" />
          </TouchableOpacity>
        </Block>
      </Container>
    )
  }
}

const renderLoadingScreen = () => {
  return (
    <Block>
      <loaders.RippleLoader size={500} strokeWidth={7} color={JolocomTheme.primaryColorPurple} />
    </Block>
  )
}

const collapsible = (claim: DecoratedClaims) => {
  const { credentialType, claimData } = claim

  const isDefaultCredentialType = CredentialTypes[credentialType]

  if (isDefaultCredentialType) {
    return false
  }

  return Object.keys(claimData).filter(key => !!claimData[key]).length > 1
}
