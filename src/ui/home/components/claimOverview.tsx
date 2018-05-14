import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Container, Block } from 'src/ui/structure'
import { ClaimCard } from 'src/ui/home/components/claimCard'
import { JolocomTheme } from 'src/styles/jolocom-theme'

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


// TODO Magic numbers
const styles = StyleSheet.create({
  textInputField: {
    flex: 1,
    width: '80%'
  },
  block: {
    marginBottom: "15%"
  },
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
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  }
})


export const ClaimOverviewComponent : React.SFC<Props> = (props) => {
  const renderAllClaims = props.claims.map((claim, i) => {
    return (
      <ClaimCard
        key={claim.claimType}
        openClaimDetails={props.openClaimDetails}
        claimType={claim.claimType}
        icon={'camera'}
        firstClaimLabel={claim.claimType}
      />
    )
  })

  return (
    <Container style={{padding: 0}}>
      <Block>
        { renderAllClaims }
        <Block style={ styles.actionButtonContainer }>
          <TouchableOpacity
            style={ styles.iconContainer }
            onPress={ props.onScannerStart }>
            <Icon
              style={ styles.icon }
              size={ 30 }
              name="qrcode-scan"
              color="white"
            />
        </TouchableOpacity>
      </Block>

    </Block>
    </Container>
  )
}
