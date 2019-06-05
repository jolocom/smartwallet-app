import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import I18n from 'src/locales/i18n'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import strings from '../../../locales/strings'

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
  },
  card: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgb(236, 236, 236)',
    flexDirection: 'row',
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

interface LanguageCardProps {
  locales: string[]
  selected: string
  setLocale: (key: string) => void
}

const LanguageCard: React.SFC<LanguageCardProps> = props => (
  <View style={[styles.card, styles.languageCard]}>
    <Icon style={{ marginRight: 18 }} size={24} name="translate" color="grey" />
    <View>
      <Text style={JolocomTheme.textStyles.light.labelDisplayFieldEdit}>
        {I18n.t(strings.LANGUAGE)}
      </Text>
      <View style={styles.languageOptions}>
        {props.locales.map(locale => {
          const isCurrentLanguage = locale === props.selected
          return (
            <View
              key={locale}
              // TODO: connect to selecting the locale
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
    </View>
  </View>
)

interface SettingsScreenProps {
  locales: string[]
  settings: { [key: string]: any }
  setLocale: (key: string) => void
  version: string
}

export const SettingsScreen: React.SFC<SettingsScreenProps> = props => (
  <View style={styles.container}>
    <View style={styles.topSection}>
      <Text style={styles.sectionHeader}>{I18n.t(strings.YOUR_PREFERENCES)}</Text>
      <LanguageCard
        setLocale={props.setLocale}
        locales={props.locales}
        selected={props.settings.locale}
      />
    </View>
    <Text style={styles.versionNumber}>
      Jolocom SmartWallet {I18n.t(strings.VERSION)} {props.version}
    </Text>
    <View />
  </View>
)
