import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { ValiditySummary } from './validitySummary'

interface Props {
  credentialName: string
  expiryDate: Date | undefined
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: JolocomTheme.primaryColorWhite,
    borderColor: JolocomTheme.secondaryColorSand,
    borderStyle: 'solid',
    borderWidth: 1
  },
  innerContainer: {
    margin: 16,
    flex: 1,
    justifyContent: 'space-between'
  },
  firstSectionHeader: {
    fontSize: JolocomTheme.headerFontSize,
    color: JolocomTheme.primaryColorBlack
  }
})

export const CredentialTopCard: React.SFC<Props> = props => {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.firstSectionHeader}>{props.credentialName}</Text>
        {props.expiryDate ? <ValiditySummary expiryDate={props.expiryDate} /> : null}
      </View>
    </View>
  )
}
