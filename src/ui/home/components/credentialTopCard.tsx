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
    justifyContent: 'space-between',
    borderColor: JolocomTheme.secondaryColorSand,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: "white",
    margin: '8%',
    paddingBottom: 20
  },
  firstSectionHeader: {
    margin: '6%',
    fontSize: JolocomTheme.landingHeaderFontSize,
    color: JolocomTheme.primaryColorBlack
  }
})

export const CredentialTopCard: React.SFC<Props> = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.firstSectionHeader}>{props.credentialName}</Text>
      { props.expiryDate ?
      <ValiditySummary expiryDate={props.expiryDate} />
      : null
      }
    </View>
  )
}
