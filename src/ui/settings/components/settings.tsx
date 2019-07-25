import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import I18n from 'src/locales/i18n'
import strings from '../../../locales/strings'
import SettingsItem from './settingsItem'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: JolocomTheme.primaryColorGrey,
  },
  topSection: {
    paddingTop: 30,
  },
  sectionHeader: {
    ...JolocomTheme.textStyles.light.labelDisplayFieldEdit,
    color: 'grey',
    marginLeft: 18,
    marginBottom: 10,
  },
  languageCard: {
    marginTop: 10,
  },
  languageSelect: {},
  languageOptions: {
    marginTop: 10,
    flexDirection: 'row',
  },
  languageOption: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 7,
    justifyContent: 'center',
    backgroundColor: 'rgb(242, 242, 242)',
    borderRadius: 4,
    marginRight: 20,
  },
  languageOptionText: {
    ...JolocomTheme.textStyles.light.labelDisplayFieldEdit,
  },
  versionNumber: {
    ...JolocomTheme.textStyles.light.labelDisplayFieldEdit,
    opacity: 0.4,
    textAlign: 'center',
    marginTop: 30,
  },
})

interface SettingsScreenProps {
  locales: string[]
  settings: { [key: string]: any }
  setLocale: (key: string) => void
  setupBackup: () => void
  version: string
}

export const SettingsScreen: React.SFC<SettingsScreenProps> = props => (
  <View style={styles.container}>
    <View style={styles.topSection}>
      <Text style={styles.sectionHeader}>
        {I18n.t(strings.YOUR_PREFERENCES)}
      </Text>
      <SettingsItem
        title={'Settings'}
        iconName={'translate'}
        payload={
          <View style={styles.languageOptions}>
            {props.locales.map(locale => {
              const isCurrentLanguage = locale === props.settings.locale
              return (
                <View
                  key={locale}
                  onTouchEnd={() => props.setLocale(locale)}
                  style={[
                    styles.languageOption,
                    isCurrentLanguage && {
                      backgroundColor: JolocomTheme.primaryColorSand,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.languageOptionText,
                      isCurrentLanguage && {
                        color: JolocomTheme.primaryColorPurple,
                      },
                    ]}
                  >
                    {locale.toUpperCase()}
                  </Text>
                </View>
              )
            })}
          </View>
        }
      />
    </View>
    <View style={styles.topSection}>
      <Text style={styles.sectionHeader}>Security</Text>
      <SettingsItem
        title={'Backup your Identity'}
        description={
          'Set up a secure phrase to recover your account in the future if your phone is stolen or is damaged.'
        }
        iconName={'flash'}
        isHighlighted
        onTouchEnd={props.setupBackup}
      />
      <SettingsItem
        title={'Delete Identity'}
        description={'(coming soon)'}
        iconName={'delete'}
      />
    </View>
    <Text style={styles.versionNumber}>
      Jolocom SmartWallet {I18n.t(strings.VERSION)} {props.version}
    </Text>
    <View />
  </View>
)
