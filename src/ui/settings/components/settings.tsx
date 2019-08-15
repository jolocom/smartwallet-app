import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import I18n from 'src/locales/i18n'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import strings from '../../../locales/strings'
import { Colors, Spacing, Typography } from 'src/styles'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLightMain,
  },
  topSection: {
    paddingTop: Spacing.XL,
  },
  sectionHeader: {
    ...Typography.sectionHeader,
    marginLeft: Spacing.MD,
  },
  card: {
    flexDirection: 'row',
    padding: Spacing.MD,
    backgroundColor: Colors.white,
    borderColor: Colors.lightGrey,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  cardLabel: {
    ...Typography.baseFontStyles,
    fontSize: Typography.textXS,
    color: Colors.blackMain,
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
    paddingTop: Spacing.XS,
    paddingBottom: Spacing.XXS,
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

interface LanguageCardProps {
  locales: string[]
  selected: string
  setLocale: (key: string) => void
}

const LanguageCard: React.FC<LanguageCardProps> = props => (
  <View style={[styles.card, styles.languageCard]}>
    <Icon
      style={{ marginRight: Spacing.MD }}
      size={24}
      name="translate"
      color="grey"
    />
    <View>
      <Text style={styles.cardLabel}>{I18n.t(strings.LANGUAGE)}</Text>
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
    </View>
  </View>
)

interface SettingsScreenProps {
  locales: string[]
  settings: { [key: string]: any }
  setLocale: (key: string) => void
  version: string
  openStorybook: () => void
}

export const SettingsScreen: React.SFC<SettingsScreenProps> = props => (
  <View style={styles.container}>
    <View style={styles.topSection}>
      <Text style={styles.sectionHeader}>
        {I18n.t(strings.YOUR_PREFERENCES)}
      </Text>
      <LanguageCard
        setLocale={props.setLocale}
        locales={props.locales}
        selected={props.settings.locale}
      />
      <TouchableOpacity style={styles.card} onPress={props.openStorybook}>
        <Text style={Typography.cardMainText}>Storybook</Text>
      </TouchableOpacity>
    </View>
    <Text style={styles.versionNumber}>
      Jolocom SmartWallet {I18n.t(strings.VERSION)} {props.version}
    </Text>
    <View />
  </View>
)
