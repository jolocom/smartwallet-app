import React from 'react'
import { ScrollView } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import BlockExpanded from '~/components/BlockExpanded'
import Section from './components/Section'
// @ts-ignore
import faqJson from '~/translations/faq.json'
import { strings } from '~/translations/strings'

type FAQArray = Array<{ question: string; answer: string }>

const FAQ = () => {
  const faqArray = faqJson as FAQArray

  return (
    <ScreenContainer
      hasHeaderBack
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <ScrollView
        overScrollMode={'never'}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Section title={strings.POPULAR_QUESTIONS} />
        {faqArray.map(({ question, answer }, i) => (
          <BlockExpanded key={i} title={question} expandedText={answer} />
        ))}
      </ScrollView>
    </ScreenContainer>
  )
}

export default FAQ
