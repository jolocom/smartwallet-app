import React, { useRef } from 'react'
import { FlatList } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import BlockExpanded from '~/components/BlockExpanded'
import Section from './components/Section'
// @ts-ignore
import faqJson from '~/translations/faq.json'
import { strings } from '~/translations/strings'

type FAQArray = Array<{ question: string; answer: string }>

const FAQ = () => {
  const faqArray = faqJson as FAQArray

  const flatlistRef = useRef<FlatList | null>(null)

  const handleExpand = (index: number) => {
    flatlistRef.current?.scrollToIndex({
      index,
      animated: true,
      //NOTE: attempts to center the view
      viewPosition: 0.5,
    })
  }

  return (
    <ScreenContainer
      hasHeaderBack
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <FlatList
        ref={flatlistRef}
        data={faqArray}
        overScrollMode={'never'}
        contentContainerStyle={{ paddingBottom: 40 }}
        style={{ width: '100%' }}
        renderItem={({ item, index }) => (
          <BlockExpanded
            key={index}
            title={item.question}
            expandedText={item.answer}
            onExpand={() => handleExpand(index)}
          />
        )}
        ListHeaderComponent={() => (
          <Section
            customStyles={{ marginBottom: 32 }}
            title={strings.POPULAR_QUESTIONS}
          />
        )}
      />
    </ScreenContainer>
  )
}

export default FAQ
