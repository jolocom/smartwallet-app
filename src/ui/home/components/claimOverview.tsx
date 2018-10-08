import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { StyleSheet, TouchableOpacity, View, Text, ScrollView } from 'react-native'
import { Container, Block } from 'src/ui/structure'
import { ClaimCard } from 'src/ui/home/components/claimCard'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { ReactNode } from 'react'
import { ClaimsState } from 'src/reducers/account'
import { DecoratedClaims } from 'src/reducers/account/'
import { defaultUiCategories, Categories } from '../../../lib/categories'
import { initialState } from '../../../reducers/account/claims';
import { areCredTypesEqual } from '../../../lib/util';
const loaders = require('react-native-indicator')

interface Props {
  claims: ClaimsState
  scanning: boolean
  onScannerStart: () => void
  openClaimDetails: (claim: DecoratedClaims) => void
}

interface State {}

const styles = StyleSheet.create({
  icon: {
    margin: '20%'
  },
  iconContainer: {
    height: 55,
    width: 55,
    borderRadius: 35,
    backgroundColor: JolocomTheme.primaryColorPurple,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 8
  },
  actionButtonContainer: {
    position: 'absolute',
    right: '3%',
    bottom: '5%',
    alignItems: 'flex-end'
  },
  sectionHeader: {
    fontSize: 17,
    textAlign: 'left',
    fontFamily: JolocomTheme.contentFontFamily
  },
  componentContainer: {
    flex: 1,
    padding: 0
  },
  scrollComponent: {
    width: '100%'
  },
  sectionContainer: {
    marginBottom: 8,
    marginTop: 27,
    marginLeft: 16,
    marginRight: 16
  }
})

export class ClaimOverview extends React.Component<Props, State> {
  render() {
    const { claims } = this.props
    const content = claims.loading ? this.renderLoadingScreen() : this.renderCategories(defaultUiCategories)

    return (
      <Container style={styles.componentContainer}>
        <ScrollView
          style={styles.scrollComponent}
          contentContainerStyle={claims.loading ? { flexGrow: 1, justifyContent: 'space-around' } : {}}
        >
          {content}
        </ScrollView>

        <Block style={styles.actionButtonContainer}>
          <TouchableOpacity style={styles.iconContainer} onPress={this.props.onScannerStart}>
            <Icon style={styles.icon} size={30} name="qrcode-scan" color="white" />
          </TouchableOpacity>
        </Block>
      </Container>
    )
  }

  private renderCategories = (categories: string[]) => {
    const toRender = categories.map(category => this.renderCategory(category))
    return [...toRender, this.renderCategory(Categories.Other)]
  }

  private renderCategory = (category: string) => {
    const credentialCards = this.renderCredentialsForCategory(category)

    if (!credentialCards.length) {
      return null
    }

    return (
      <View key={category}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>{category.toString()}</Text>
        </View>
        {credentialCards}
      </View>
    )
  }

  private renderCredentialsForCategory(category: string): ReactNode[] {
    const { openClaimDetails, claims } = this.props

    const decoratedClaims: DecoratedClaims[] = claims.decoratedCredentials[category] || []
    const defaultEntriesForCategory = initialState.decoratedCredentials[category] || []

    const missingEntries = defaultEntriesForCategory.filter(expectedEntryType =>
      !decoratedClaims.find(credential => areCredTypesEqual(credential.type, expectedEntryType.type))
    )

    const placeholders = missingEntries.map(missingCred => <ClaimCard openClaimDetails={openClaimDetails} claimItem={missingCred} />)

    const localCredentials = decoratedClaims.map((claim: DecoratedClaims) => {
      return <ClaimCard openClaimDetails={openClaimDetails} claimItem={claim} />
    })

    return [...localCredentials, ...placeholders]
  }

  private renderLoadingScreen() {
    return (
      <Block>
        <loaders.RippleLoader size={500} strokeWidth={7} color={JolocomTheme.primaryColorPurple} />
      </Block>
    )
  }
}
