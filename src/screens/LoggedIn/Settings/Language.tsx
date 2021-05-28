import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import SingleSelectBlock, {
  BlockSelection,
} from '~/components/SingleSelectBlock'
import Section from './components/Section'
import useTranslation from '~/hooks/useTranslation'
import { Locales, strings } from '~/translations'
import { useAgent } from '~/hooks/sdk'

const Language = () => {
  const { t, changeLanguage, currentLanguage } = useTranslation()
  const agent = useAgent()

  const languages = [
    { id: Locales.en, value: t(strings.ENGLISH), disabled: true },
    { id: Locales.de, value: t(strings.GERMAN), disabled: true },
  ]

  const storedLanguage = languages.find((l) => l.id === currentLanguage)

  const handleLanguageChange = async (language: BlockSelection) => {
    return changeLanguage(language.id as Locales, agent)
  }

  return (
    <ScreenContainer
      hasHeaderBack
      customStyles={{
        paddingTop: 0,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      }}
    >
      <Section.Title>{t(strings.LANGUAGE)}</Section.Title>
      <SingleSelectBlock
        initialSelect={storedLanguage}
        selection={languages}
        onSelect={handleLanguageChange}
      />
    </ScreenContainer>
  )
}

export default Language
