import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { StyleSheet, TouchableOpacity, Text, View, ScrollView } from 'react-native'
import { Container, Block } from 'src/ui/structure'
import { ClaimCard } from 'src/ui/home/components/claimCard'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { ReactNode } from 'react'
import { ClaimsState } from 'src/reducers/account'
import { DecoratedClaims, CategorizedClaims } from 'src/reducers/account/'
import { Categories } from 'src/actions/account/categories'

interface Props {
  claims: ClaimsState
  scanning: boolean
  onScannerStart: () => void
  openClaimDetails: (claim: DecoratedClaims) => void
}

interface State {
}

const styles = StyleSheet.create({
  icon: {
    margin: "20%"
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
    elevation: 8,
  },
  actionButtonContainer: {
    position: 'absolute',
    right: '3%',
    bottom: '5%',
    alignItems: 'flex-end'
  },
  sectionHeader: {
    fontSize: 17,
    textAlign: 'left'
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

  renderClaimCards = (category: string) : ReactNode => {
    const { openClaimDetails, claims } = this.props
    const decoratedClaims: CategorizedClaims = claims.claims
    const categoryClaims: DecoratedClaims[] = decoratedClaims.get[category]
    return categoryClaims.map((claim: DecoratedClaims) => {
        return (
          <ClaimCard
            openClaimDetails={ openClaimDetails }
            claimItem={ claim }
          />
        )
    })
  }

  render() {
    const { claims } = this.props
    const claimsCategories = Object.keys(Categories)
    const content = claims.loading ? ( <View><Text>Loading</Text></View>) :
      (claimsCategories.map((category: string) => {
          return (
            <View key={category}>
              <View style={ styles.sectionContainer }>
                <Text style={ styles.sectionHeader }>{ category.toString() }</Text>
              </View>
              { this.renderClaimCards(category) }
            </View>
          )
        })
      )

    return (
      <Container style={ styles.componentContainer }>
        <ScrollView style={ styles.scrollComponent }>
          { content }
        </ScrollView>
        <Block style={ styles.actionButtonContainer }>
          <TouchableOpacity
            style={ styles.iconContainer }
            onPress={ this.props.onScannerStart }>
            <Icon
              style={ styles.icon }
              size={ 30 }
              name='qrcode-scan'
              color="white"
            />
          </TouchableOpacity>
        </Block>
      </Container>
    )
  }
}
