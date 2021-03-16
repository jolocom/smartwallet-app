import React, { useRef } from 'react'
import { FlatList } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import BlockExpanded from '~/components/BlockExpanded'
import Section from './components/Section'
// @ts-ignore
import faqJson from '~/translations/faq.json'
import { strings } from '~/translations/strings'
import Collapsible from '~/components/Collapsible'
import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'

type FAQArray = Array<{ question: string; answer: string }>

const FAQ = () => {
  const faqArray = faqJson as FAQArray

  const flatlistRef = useRef<FlatList | null>(null)

  const handleExpand = (index: number) => {
    flatlistRef.current?.scrollToIndex({
      index,
      //NOTE: attempts to center the view
      viewPosition: 0.5,
    })
  }

  return (
    <Collapsible>
      <Collapsible.Header>
        <NavigationHeader type={NavHeaderType.Back}>
          <Collapsible.HeaderText>
            {strings.POPULAR_QUESTIONS}
          </Collapsible.HeaderText>
        </NavigationHeader>
      </Collapsible.Header>
      <ScreenContainer
        //hasHeaderBack
        customStyles={{ justifyContent: 'flex-start', paddingTop: 0 }}
      >
        <Collapsible.FlatList
          renderHidingText={() => (
            <Section.Title>{strings.POPULAR_QUESTIONS}</Section.Title>
          )}
          data={faqArray}
          overScrollMode={'never'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 40,
          }}
          style={{ width: '100%' }}
          // @ts-ignore
          ref={flatlistRef}
          // @ts-ignore
          renderItem={({ item, index }) => (
            <BlockExpanded
              key={index}
              title={item.question}
              expandedText={item.answer}
              onExpand={() => handleExpand(index)}
            />
          )}
        />
      </ScreenContainer>
    </Collapsible>
  )
}

export default FAQ
