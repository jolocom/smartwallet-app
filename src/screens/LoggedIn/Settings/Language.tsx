import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import SingleSelectBlock, {
  BlockSelection,
} from '~/components/SingleSelectBlock'
import Section from './components/Section'
import { strings } from '~/translations/strings'

const mockLanguages = [
  { id: 'en', value: 'English' },
  { id: 'de', value: 'German' },
  { id: 'nl', value: 'Dutch' },
]

const Language = () => {
  const handleLanguageChange = (language: BlockSelection) => {
    console.log('changing language to ', language.value)
  }

  return (
    <ScreenContainer
      hasHeaderBack
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <Section title={strings.LANGUAGE} customStyles={{ marginBottom: 0 }} />
      <SingleSelectBlock
        selection={mockLanguages}
        onSelect={handleLanguageChange}
      />
    </ScreenContainer>
  )
}

export default Language
