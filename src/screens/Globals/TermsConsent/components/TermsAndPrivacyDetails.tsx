import React, { useState } from 'react'
import ScreenContainer from '~/components/ScreenContainer'
import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'
import { View, StyleSheet, Text, ScrollView, Linking } from 'react-native'
import { useGoBack } from '~/hooks/navigation'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import IconBtn from '~/components/IconBtn'
import BottomSheet from '~/components/BottomSheet'
import SingleSelectBlock from '~/components/SingleSelectBlock'
import useTranslation from '~/hooks/useTranslation'
import { Locales } from '~/translations'
import ScreenDismissArea from '~/components/ScreenDismissArea'
import { LanguageIcon, SendEmailIcon } from '~/assets/svg'

interface ITermsTemplate {
  title: string
  enText: string
  deText: string
}

const TermsTemplate: React.FC<ITermsTemplate> = ({ title, enText, deText }) => {
  const goBack = useGoBack()
  const { t, currentLanguage } = useTranslation()

  const [language, setLanguage] = useState(currentLanguage)
  const [visibility, setVisibility] = useState(false)

  const languages = [
    { id: Locales.en, value: t('Language.english'), disabled: false },
    { id: Locales.de, value: t('Language.german'), disabled: false },
  ]

  const storedLanguage = languages.find((l) => l.id === language)

  const handleLanguage = ({ value }) => {
    value === 'English' || value === 'Englisch'
      ? setLanguage('en')
      : setLanguage('de')
    setVisibility(false)
  }

  const handlePress = () => {
    setVisibility(!visibility)
  }

  const handleShare = async () => {
    await Linking.openURL(
      `mailto:?subject=${title}&body=${language === 'en' ? enText : deText}`,
    )
  }

  return (
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
        paddingTop: 0,
        paddingHorizontal: 0,
      }}
    >
      <NavigationHeader
        type={NavHeaderType.Back}
        onPress={goBack}
        customStyles={{ paddingHorizontal: 5 }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 10,
          }}
        >
          <JoloText kind={JoloTextKind.title}>{title}</JoloText>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '20%',
            }}
          >
            <IconBtn onPress={handlePress}>
              <LanguageIcon />
            </IconBtn>
            <IconBtn onPress={handleShare}>
              <SendEmailIcon />
            </IconBtn>
          </View>
        </View>
      </NavigationHeader>
      <View style={styles.contentContainer}>
        <ScrollView indicatorStyle={'white'}>
          {language === 'en' && (
            <Text style={styles.heading}>
              {/* NOTE: make text dynamic*/}
              Please note that the German version is legally binding
            </Text>
          )}
          <Text style={styles.text}>{language === 'en' ? enText : deText}</Text>
        </ScrollView>
      </View>
      {visibility && (
        <View style={styles.overlay}>
          <ScreenDismissArea onDismiss={handlePress}></ScreenDismissArea>
          <BottomSheet showSlide={true}>
            <SingleSelectBlock
              initialSelect={storedLanguage}
              selection={languages}
              onSelect={handleLanguage}
            />
          </BottomSheet>
        </View>
      )}
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  heading: {
    color: '#ffcc01',
    fontSize: 16,
    paddingBottom: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    paddingBottom: 50,
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.4)',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
})

export default TermsTemplate
