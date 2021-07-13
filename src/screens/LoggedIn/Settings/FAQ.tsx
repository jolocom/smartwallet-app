import React, { useRef } from 'react'
import { FlatList } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import BlockExpanded from '~/components/BlockExpanded'
import Section from './components/Section'
import Collapsible from '~/components/Collapsible'
import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'
import useTranslation from '~/hooks/useTranslation'

const FAQ = () => {
  const { t } = useTranslation()
  const faqArray = [
    {
      question: t('FAQ.header_q1'),
      answer: t('FAQ.subheader_q1'),
    },
    {
      question: t('FAQ.header_q2'),
      answer: t('FAQ.subheader_q2'),
    },
    {
      question: t('FAQ.header_q3'),
      answer: t('FAQ.subheader_q3'),
    },
    {
      question: t('FAQ.header_q4'),
      answer: t('FAQ.subheader_q4'),
    },
  ]

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
          <Collapsible.HeaderText>{t('FAQ.header')}</Collapsible.HeaderText>
        </NavigationHeader>
      </Collapsible.Header>
      <ScreenContainer
        customStyles={{ justifyContent: 'flex-start', paddingTop: 0 }}
      >
        <Collapsible.FlatList
          renderHidingText={() => (
            <Section.Title>{t('FAQ.header')}</Section.Title>
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
