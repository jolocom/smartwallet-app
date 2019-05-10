import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

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

const languages = ['EN', 'DE', 'NL']

interface LanguageCardProps {
  languages: string[]
  selected: string
}

const LanguageCard: React.SFC<LanguageCardProps> = props => (
  <View style={[styles.card, styles.languageCard]}>
    <Icon style={{ marginRight: 18 }} size={24} name="translate" color="grey" />
    <View>
      <Text style={JolocomTheme.textStyles.light.labelDisplayFieldEdit}>
        Language
      </Text>
      <View style={styles.languageOptions}>
        {props.languages.map(language => {
          const isCurrentLanguage = language === props.selected
          return (
            <View
              // TODO: connect to selecting the language
              onTouchEnd={() => console.log(`${language} selected`)}
              style={[
                styles.languageOption,
                isCurrentLanguage && {
                  backgroundColor: JolocomTheme.primaryColorPurple,
                },
              ]}
            >
              <Text
                style={[
                  styles.languageOptionText,
                  isCurrentLanguage && {
                    color: JolocomTheme.primaryColorSand,
                  },
                ]}
              >
                {language}
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  </View>
)

const VERSION = '1.4.2'

export const SettingsScreen: React.SFC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.sectionHeader}>Your preferences</Text>
        {/* SELECTED should be based on state from the database */}
        <LanguageCard languages={languages} selected={languages[0]} />
      </View>
      <Text style={styles.versionNumber}>
        Jolocom SmartWallet version {VERSION}
      </Text>
      <View />
    </View>
  )
}
