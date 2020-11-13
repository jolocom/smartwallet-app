import React from 'react'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { JoloTextSizes } from '~/utils/fonts'
import BlockExpanded from '~/components/BlockExpanded'
import Section from './components/Section'
// @ts-ignore
import faqJson from '~/translations/faq.json'
import { strings } from '~/translations/strings'
import { ScrollView } from 'react-native-gesture-handler'

type FAQArray = Array<{ question: string; answer: string }>

const FAQ = () => {
  const faqArray = faqJson as FAQArray

  return (
    <ScreenContainer
      hasHeaderBack
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Section title={strings.POPULAR_QUESTIONS} />
        {faqArray.map(({ question, answer }, i) => (
          <BlockExpanded key={i} title={question} expandedText={answer} />
        ))}
      </ScrollView>
    </ScreenContainer>
  )
}

export default FAQ
