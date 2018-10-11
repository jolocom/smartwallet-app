import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native'
import { Container, Block } from 'src/ui/structure'
import { CredentialCard } from './credentialCard'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { ReactNode } from 'react'
import { ClaimsState, CategorizedClaims } from 'src/reducers/account'
import { DecoratedClaims } from 'src/reducers/account/'
const loaders = require('react-native-indicator')

interface Props {
  claimsState: ClaimsState
  scanning: boolean
  loading: boolean
  onScannerStart: () => void
  onEdit: (claim: DecoratedClaims) => void
}

interface State {}

const styles = StyleSheet.create({
  iconContainer: {
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
  }
})

export class CredentialOverview extends React.Component<Props, State> {
  renderCredentialCard = (category: string): ReactNode => {
    const { onEdit, claimsState } = this.props

    const decoratedCredentials: CategorizedClaims = claimsState.decoratedCredentials
    const categorizedCredentials: DecoratedClaims[] = decoratedCredentials[category] || []

    // TODO Don't use collapsible for 2 different things, rely on other func
    return categorizedCredentials.map((claim: DecoratedClaims) => (
      <CredentialCard
        openClaimDetails={onEdit}
        credentialItem={claim}
        collapsible={collapsible(claim)}
        shouldDisplayTitle={collapsible(claim)}
        empty={Object.keys(claim.claimData).every(key => !claim.claimData[key])}
      />
    ))
  }

  renderCredentialCategory = (category: string) => ([
    <Text style={styles.sectionHeader}>{category.toString()}</Text>,
    this.renderCredentialCard(category)
  ])


  render() {
    const { claimsState } = this.props
    const claimsCategories = Object.keys(claimsState.decoratedCredentials)

    if (claimsState.loading) {
      return renderLoadingScreen()
    }

    return (
      <Container style={{padding: 0}}>
        <ScrollView
          style={styles.scrollComponent}
          contentContainerStyle={claimsState.loading ? { flexGrow: 1, justifyContent: 'space-around'}: {}}
        >
          {claimsCategories.map(this.renderCredentialCategory)}
        </ScrollView>
        <Block style={styles.qrCodeButtonSection}>
          <TouchableOpacity style={styles.iconContainer} onPress={this.props.onScannerStart}>
            <Icon size={30} name="qrcode-scan" color="white" />
          </TouchableOpacity>
        </Block>
      </Container>
    )
  }
}

// TODO -> Move to util, merge with canonical function
const renderLoadingScreen = () => {
  return (
    <Block>
      <loaders.RippleLoader size={500} strokeWidth={7} color={JolocomTheme.primaryColorPurple} />
    </Block>
  )
}

const collapsible = (claim: DecoratedClaims) => ['Mobile Phone', 'Phone', 'E-mail', 'Email', 'Name'].indexOf(claim.credentialType) === -1 