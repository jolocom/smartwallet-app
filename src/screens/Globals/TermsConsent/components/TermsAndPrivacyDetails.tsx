import React, { useState } from 'react'
import ScreenContainer from '~/components/ScreenContainer'
import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'
import { StyleSheet, Text, ScrollView } from 'react-native'
import { useGoBack } from '~/hooks/navigation'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import IconBtn from '~/components/IconBtn'
import BottomSheet from '~/components/BottomSheet'
import SingleSelectBlock, {
  BlockSelection,
} from '~/components/SingleSelectBlock'
import useTranslation from '~/hooks/useTranslation'
import { Locales } from '~/translations'
import { LanguageIcon } from '~/assets/svg'
import { Colors } from '~/utils/colors'

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

  const handleLanguage = ({ id }: BlockSelection) => {
    setLanguage(id)
    setVisibility(false)
  }

  const handlePress = () => {
    setVisibility(true)
  }

  return (
    <>
      <ScreenContainer
        customStyles={{
          justifyContent: 'flex-start',
          paddingHorizontal: 0,
        }}
      >
        <NavigationHeader
          type={NavHeaderType.Back}
          onPress={goBack}
          customStyles={{ paddingHorizontal: 5 }}
        >
          <JoloText kind={JoloTextKind.title}>{title}</JoloText>
          <IconBtn onPress={handlePress}>
            <LanguageIcon />
          </IconBtn>
        </NavigationHeader>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {language === 'en' && (
            <Text style={styles.heading}>
              {/* NOTE: make text dynamic*/}
              Please note that the German version is legally binding
            </Text>
          )}
          <Text style={styles.text}>{language === 'en' ? enText : deText}</Text>
        </ScrollView>
      </ScreenContainer>
      <BottomSheet
        customStyles={styles.bottomSheet}
        onDismiss={() => setVisibility(false)}
        visible={visibility}
      >
        <SingleSelectBlock
          initialSelect={storedLanguage}
          selection={languages}
          onSelect={handleLanguage}
        />
      </BottomSheet>
    </>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heading: {
    color: Colors.error,
    fontSize: 16,
    paddingBottom: 10,
  },
  text: {
    color: Colors.white,
    fontSize: 16,
    paddingBottom: 50,
  },
  bottomSheet: {
    backgroundColor: Colors.haiti,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
})

export default TermsTemplate
