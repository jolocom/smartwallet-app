import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { ValiditySummary } from './validitySummary'

interface Props {
  credentialName: string,
  expiryDate: Date | undefined
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: JolocomTheme.secondaryColorSand,
    borderStyle: 'solid',
    borderWidth: 2,
    backgroundColor: "white",
    marginTop: '8%',
    marginLeft:'8%',
    marginRight: '8%'
  },
  firstSectionHeader: {
    paddingLeft: '5%',
    paddingTop: '5%',
    fontSize: JolocomTheme.landingHeaderFontSize,
    color: JolocomTheme.primaryColorBlack,
    flex: 0.3,
  },
  firstSectionSpacer: {
    flex: 0.3
  },
  firstSectionExpirySpacer: {
    flex: 0.2
  }
})

export const CredentialTopCard: React.SFC<Props> = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.firstSectionHeader}>{props.credentialName}</Text>
      <View style={styles.firstSectionSpacer}></View>
      { props.expiryDate ?
      <ValiditySummary expiryDate={props.expiryDate} />
      : <Text style={styles.firstSectionExpirySpacer}></Text>
      }
    </View>
  )
}
