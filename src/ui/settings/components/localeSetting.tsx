import { StyleSheet, Text, View } from 'react-native'
import { Colors, Spacing, Typography } from '../../../styles'
import React from 'react'

const styles = StyleSheet.create({
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
})

interface ComponentProps {
  locales: string[]
  currentLocale: string
  setLocale: (key: string) => void
}

interface CardProps extends Omit<ComponentProps, 'locales'> {
  locale: string
}

const LocaleCard = (props: CardProps) => {
  const { locale, setLocale } = props
  const isCurrentLanguage = locale === props.currentLocale
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
}

export const LocaleSetting: React.FC<ComponentProps> = props => {
  const { currentLocale, setLocale } = props
  return (
    <View style={styles.languageOptions}>
      {props.locales.map(locale => {
        return (
          <LocaleCard
            locale={locale}
            setLocale={setLocale}
            currentLocale={currentLocale}
          />
        )
      })}
    </View>
  )
}
