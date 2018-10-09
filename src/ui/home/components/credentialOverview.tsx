import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { StyleSheet, TouchableOpacity, View, Text, ScrollView } from 'react-native'
import { Container, Block } from 'src/ui/structure'
import { CredentialCard } from './credentialCard'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { ReactNode } from 'react'
import { ClaimsState } from 'src/reducers/account'
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

const mockClaims = {
  Name: [
    {
      credentialType: 'Name',
      claimData: {
        firstName: 'Eugeniu',
        lastName: 'Rusu'
      },
      id: '1234',
      issuer: 'did:jolo:issuer',
      subject: 'did:jolo:subject'
    }
  ],
  Phone: [
    {
      credentialType: 'Phone',
      claimData: {
        telephone: '0123456'
      },
      id: '4321',
      issuer: 'did:jolo:secondIssuer',
      subject: 'did:jolo:secondSubject'
    },
    {
      credentialType: 'Phone',
      claimData: {
        telelphone: '543221'
      },
      id: '00x1',
      issuer: 'did:jolo:second',
      subject: 'did:jolo:hek'
    }
  ],
  Email: [
    {
      credentialType: 'Email',
      claimData: {
        email: 'eugeniu@jolocom.com'
      },
      id: '4321',
      issuer: 'did:jolo:thirdIssuer',
      subject: 'did:jolo:thirdSubject'
    }
  ],
  Other: [
    {
      credentialType: 'Address',
      claimData: {
        street: 'Buchfinkweg',
        house: '11a',
        plz: '12351',
        region: 'Berlin',
        country: 'Germany'
      },
      id: '0x0x',
      issuer: 'did:jolo:buch',
      subject: 'did:jolo:something'
    }
  ]
}

export class CredentialOverview extends React.Component<Props, State> {
  renderCredentialCard = (category: string): ReactNode => {
    const { onEdit } = this.props

    const decoratedCredentials = mockClaims
    const categorizedCredentials: DecoratedClaims[] = decoratedCredentials[category] || []

    console.log(decoratedCredentials)
    return categorizedCredentials.map((claim: DecoratedClaims, index) => {
      return (
        <CredentialCard
          openClaimDetails={onEdit}
          credentialItem={claim}
          displayTitle={false}
          // TODO DYNAMIC
          collapsible={true}
        />
      )
    })
  }

  render() {
    const { claimsState } = this.props
    const claimsCategories = Object.keys(mockClaims)

    const content = claimsState.loading ? (
      <Block>
        <loaders.RippleLoader size={500} strokeWidth={7} color={JolocomTheme.primaryColorPurple} />
      </Block>
    ) : (
      claimsCategories.map((category: string) => {
        return (
          <View key={category}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeader}>{category.toString()}</Text>
            </View>
            {this.renderCredentialCard(category)}
          </View>
        )
      })
    )

    return (
      <Container style={styles.componentContainer}>
        <ScrollView
          style={styles.scrollComponent}
          contentContainerStyle={claimsState.loading ? { flexGrow: 1, justifyContent: 'space-around' } : {}}
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
}
