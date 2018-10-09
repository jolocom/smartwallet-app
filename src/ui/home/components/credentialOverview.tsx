import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { StyleSheet, TouchableOpacity, View, Text, ScrollView } from 'react-native'
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
  actionButtonContainer: {},
  sectionHeader: {
    fontSize: 17,
    textAlign: 'left',
    fontFamily: JolocomTheme.contentFontFamily
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

export class CredentialOverview extends React.Component<Props, State> {
  renderCredentialCard = (category: string): ReactNode => {
    const { onEdit, claimsState } = this.props

    const decoratedCredentials: CategorizedClaims = {
      ...claimsState.decoratedCredentials,
      Other: [
        {
          credentialType: 'Postal address',
          claimData: {
            street: 'Buchfinkweg',
            houseNr: '19',
            plz: '123456',
            area: 'Berlin',
            country: 'Germany'
          },
          id: '0x01234',
          issuer: 'did:jolo:extra',
          subject: 'did:jolo:extrasubj'
        }
      ]
    }

    const categorizedCredentials: DecoratedClaims[] = decoratedCredentials[category] || []

    return categorizedCredentials.map((claim: DecoratedClaims, index) => {

      // TODO Don't use collapsible for 2 different things, rely on other func
      return (
        <CredentialCard
          openClaimDetails={onEdit}
          credentialItem={claim}
          collapsible={collapsible(claim)}
          displayTitle={collapsible(claim)}
        />
      )
    })
  }

  render() {
    const { claimsState } = this.props
    const claimsCategories = [...Object.keys(claimsState.decoratedCredentials), 'Other']

    if (claimsState.loading) {
      return renderLoadingScreen()
    }

    return (
      <Container style={{ flex: 1, padding: 0 }}>
        <ScrollView
          style={styles.scrollComponent}
          contentContainerStyle={claimsState.loading ? { flexGrow: 1, justifyContent: 'space-around' } : {}}
        >
          {claimsCategories.map((category: string) => {
            return (
              <View key={category}>
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionHeader}>{category.toString()}</Text>
                </View>
                {this.renderCredentialCard(category)}
              </View>
            )
          })}
        </ScrollView>
        <Block
          style={{
            position: 'absolute',
            right: '3%',
            bottom: '5%',
            alignItems: 'flex-end'
          }}
        >
          <TouchableOpacity style={styles.iconContainer} onPress={this.props.onScannerStart}>
            <Icon style={styles.icon} size={30} name="qrcode-scan" color="white" />
          </TouchableOpacity>
        </Block>
      </Container>
    )
  }
}

// TODO -> Move to util, merge with canonical function
const renderLoadingScreen = () => {
  return <Block>
    <loaders.RippleLoader size={500} strokeWidth={7} color={JolocomTheme.primaryColorPurple} />
  </Block>
}
const collapsible = (claim: DecoratedClaims) => ['Mobile Phone', 'Phone', 'E-mail', 'Email', 'Name'].indexOf(claim.credentialType) === -1