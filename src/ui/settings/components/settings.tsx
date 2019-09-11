import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import I18n from 'src/locales/i18n'
import strings from '../../../locales/strings'
import { Colors, Spacing, Typography } from 'src/styles'
import SettingsItem from './settingsItem'
import settingKeys from '../settingKeys'
import { Container } from 'src/ui/structure'

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
  topSection: {
    paddingTop: Spacing.XL,
  },
  sectionHeader: {
    ...Typography.sectionHeader,
    marginLeft: Spacing.MD,
    marginBottom: Spacing.XS,
  },
  languageCard: {
    marginTop: Spacing.SM,
  },
  languageSelect: {},
  languageOptions: {
    flexDirection: 'row',
    marginTop: Spacing.SM,
  },
  languageOption: {
    justifyContent: 'center',
    backgroundColor: Colors.lightGreyLight,
    borderRadius: 4,
    paddingHorizontal: Spacing.MD,
    paddingVertical: Spacing.XS,
    marginRight: Spacing.MD,
  },
  languageOptionText: {
    ...Typography.baseFontStyles,
    fontSize: Typography.textXS,
    color: Colors.blackMain,
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
  locales: string[]
  settings: { [key: string]: {} }
  setLocale: (key: string) => void
  setupBackup: () => void
  version: string
  setupSocialRecovery: () => void
}

export const SettingsScreen: React.FunctionComponent<SettingsScreenProps> = ({
  settings,
  locales,
  version,
  setLocale,
  setupBackup,
  setupSocialRecovery,
}) => {
  const seedPhraseSaved = settings[settingKeys.seedPhraseSaved] as boolean
  return (
    <Container style={styles.container}>
      <ScrollView
        style={styles.scrollComponent}
        contentContainerStyle={styles.scrollComponentContainer}
      >
        <View style={styles.topSection}>
          <Text style={styles.sectionHeader}>
            {I18n.t(strings.YOUR_PREFERENCES)}
          </Text>
          <SettingsItem
            title={I18n.translate(strings.LANGUAGE)}
            iconName={'translate'}
            payload={
              <View style={styles.languageOptions}>
                {locales.map(locale => {
                  const isCurrentLanguage = locale === settings.locale
                  return (
                    <View
                      key={locale}
                      onTouchEnd={() => setLocale(locale)}
                      style={[
                        styles.languageOption,
                        isCurrentLanguage && {
                          backgroundColor: Colors.sandLight,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.languageOptionText,
                          isCurrentLanguage && {
                            color: Colors.purpleMain,
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
            title={I18n.t(strings.BACKUP_YOUR_IDENTITY)}
            iconName={'flash'}
            description={
              seedPhraseSaved
                ? I18n.t(strings.YOUR_IDENTITY_IS_ALREADY_BACKED_UP)
                : I18n.t(
                    strings.SET_UP_A_SECURE_PHRASE_TO_RECOVER_YOUR_ACCOUNT_IN_THE_FUTURE_IF_YOUR_PHONE_IS_STOLEN_OR_IS_DAMAGED,
                  )
            }
            isHighlighted={!seedPhraseSaved}
            isDisabled={seedPhraseSaved}
            onPress={setupBackup}
          />
          <SettingsItem
            title={'Social Recovery'}
            iconName={'account-multiple'}
            description={'Enable your friends to help you in case of recovery'}
            onPress={setupSocialRecovery}
          />
          <SettingsItem
            title={I18n.t(strings.DELETE_IDENTITY)}
            description={'(coming soon)'}
            iconName={'delete'}
            isDisabled
          />
        </View>
        <Text style={styles.versionNumber}>
          Jolocom SmartWallet {I18n.t(strings.VERSION)} {version}
        </Text>
        <View />
      </ScrollView>
    </Container>
  )
}
