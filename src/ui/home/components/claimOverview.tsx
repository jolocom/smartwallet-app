import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { StyleSheet, TouchableOpacity, Text, View, ScrollView } from 'react-native'
import { Container, Block } from 'src/ui/structure'
import { ClaimCard } from 'src/ui/home/components/claimCard'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { ReactNode } from 'react'

// TODO: adjust to actual structure
interface Claim {
  claimType: string
  claimValue?: string
}

interface Props {
  claims: Claim[]
  scanning: boolean
  onScannerStart: () => void
  openClaimDetails: (selectedType : string) => void
}

interface State {
  orderedClaims: {
    [key: string] : Claim[]
  }
}

interface IIconMap {
  [key: string]: string
}

const iconMap : IIconMap = {
  name: 'person',
  email: 'camera',
  phone: 'camera'
}

const styles = StyleSheet.create({
  icon: {
    margin: "20%"
  },
  iconContainer: {
    height: 55,
    width: 55,
    borderRadius: 35,
    backgroundColor: JolocomTheme.palette.primaryColor,
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

export class ClaimOverviewComponent extends React.Component<Props, State> {

  state = {
    orderedClaims: {
      personal: [],
      contact: [],
    }
  }

  componentDidMount() {
    if (this.state.orderedClaims.personal.length === 0) {
      let personalClaims : Claim[] = []
      let contactClaims : Claim[] = []

      this.props.claims.map((claim, i) => {
        if (claim.claimType === 'name') {
          personalClaims.push(claim)
        } else if (claim.claimType === 'phone' || claim.claimType === 'email') {
          contactClaims.push(claim)
        }
      })

      this.setState({
        orderedClaims: {
          personal: personalClaims,
          contact: contactClaims
        }
      })
    }
  }


  private renderSection = (category: string) : ReactNode => {
    return this.state.orderedClaims[category].map((claim: Claim, i: number) => {
      if (claim.claimType === 'name') {
        if (claim.claimValue === undefined) {
          return (
            <ClaimCard
              key={ claim.claimType }
              openClaimDetails={ this.props.openClaimDetails }
              claimType={ claim.claimType }
              icon={ iconMap[claim.claimType] }
              firstClaimLabel={ claim.claimType }
            />
          )
        } else {
          return (
            <ClaimCard
              key={ claim.claimType }
              openClaimDetails={ this.props.openClaimDetails }
              claimType={ claim.claimType }
              icon={ iconMap[claim.claimType] }
              firstClaimLabel={ 'first Name' }
              firstClaimValue={ claim.claimValue }
              secondClaimLabel={ 'last Name '}
              secondClaimValue={ claim.claimValue }
              claimLines={2}
            />
          )
        }
      } else {
        return (
          <ClaimCard
            key={ claim.claimType }
            openClaimDetails={ this.props.openClaimDetails }
            claimType={ claim.claimType }
            icon={ iconMap[claim.claimType] }
            firstClaimLabel={ claim.claimType }
            firstClaimValue={ claim.claimValue }
          />
        )
      }
    })

  }

  render() {
    return (
      <Container style={ styles.componentContainer }>
        <ScrollView style={ styles.scrollComponent }>

          {
            this.state.orderedClaims.personal.length > 0 ?
            (<View>
              <View style={ styles.sectionContainer }>
                <Text style={ styles.sectionHeader }>Personal / general</Text>
              </View>
              { this.renderSection('personal') }
            </View>) :
            null
          }

          {
            this.state.orderedClaims.contact.length > 0 ?
            <View>
              <View style={ styles.sectionContainer }>
                <Text style={ styles.sectionHeader }>Contact</Text>
              </View>
              { this.renderSection('contact') }
            </View> :
            null
          }

        </ScrollView>

        <Block style={ styles.actionButtonContainer }>
          <TouchableOpacity
            style={ styles.iconContainer }
            onPress={ this.props.onScannerStart }>
            <Icon
              style={ styles.icon }
              size={ 30 }
              name="qrcode-scan"
              color="white"
            />
          </TouchableOpacity>
        </Block>

      </Container>
    )
  }
}
