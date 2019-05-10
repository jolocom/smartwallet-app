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
    backgroundColor: JolocomTheme.primaryColorWhite,
    borderColor: JolocomTheme.secondaryColorSand,
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 16,
  },
  firstSectionHeader: {
    fontSize: JolocomTheme.landingHeaderFontSize,
    fontFamily: JolocomTheme.contentFontFamily,
    color: JolocomTheme.primaryColorBlack,
  },
})

export const CredentialTopCard: React.SFC<Props> = props => (
  <View style={styles.container}>
    <Text style={styles.firstSectionHeader}>{props.credentialName}</Text>
    <View style={{ marginTop: 30 }}>
      {props.expiryDate ? (
        <ValiditySummary expiryDate={props.expiryDate} />
      ) : null}
    </View>
  </View>
)
