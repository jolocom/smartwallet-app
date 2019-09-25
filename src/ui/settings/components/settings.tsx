import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import I18n from 'src/locales/i18n'
import strings from '../../../locales/strings'
import { Colors, Spacing, Typography } from 'src/styles'
import { Container } from 'src/ui/structure'
import { LocaleSetting } from '../containers/localeSetting'
import { SettingSection } from './settingSection'
import { BackupSetting } from '../containers/backupSetting'

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundLightMain,
  },
  scrollComponent: {
    width: '100%',
  },
  scrollComponentContainer: {
    paddingBottom: Spacing.XXL,
  },
  versionNumber: {
    ...Typography.baseFontStyles,
    fontSize: Typography.textXS,
    textAlign: 'center',
    color: Colors.blackMain040,
    marginTop: Spacing.XL,
  },
})

interface SettingsScreenProps {
  version: string
}

export const SettingsScreen: React.SFC<SettingsScreenProps> = props => {
  return (
    <Container style={styles.container}>
      <ScrollView
        style={styles.scrollComponent}
        contentContainerStyle={styles.scrollComponentContainer}
      >
        <SettingSection title={I18n.t(strings.YOUR_PREFERENCES)}>
          <LocaleSetting />
        </SettingSection>
        <SettingSection title={I18n.t(strings.SECURITY)}>
          <BackupSetting />
          {/* <DeleteIdentitySetting /> */}
        </SettingSection>
        <Text style={styles.versionNumber}>
          Jolocom SmartWallet {I18n.t(strings.VERSION)} {props.version}
        </Text>
        <View />
      </ScrollView>
    </Container>
  )
}
