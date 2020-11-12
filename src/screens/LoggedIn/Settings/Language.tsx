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
    { id: Locales.en, value: t(strings.ENGLISH) },
    { id: Locales.de, value: t(strings.GERMAN) },
  ]

  const initialSelection = languages.find((l) => l.id === currentLanguage)

  const handleLanguageChange = async (language: BlockSelection) => {
    return changeLanguage(language.id as Locales, agent)
  }

  return (
    <ScreenContainer
      hasHeaderBack
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <Section title={t(strings.LANGUAGE)} customStyles={{ marginBottom: 0 }} />
      <SingleSelectBlock
        initialSelect={initialSelection}
        selection={languages}
        onSelect={handleLanguageChange}
      />
    </ScreenContainer>
  )
}

export default Language
