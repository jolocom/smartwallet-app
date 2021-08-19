import { useRef } from 'react'
import React from 'react'
import {
  Animated,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import BlockExpanded from '~/components/BlockExpanded'
import CollapsibleClone from '~/components/CollapsibleClone'

type TFAQItem = { question: string; answer: string }
import useTranslation from '~/hooks/useTranslation'
import Section from './components/Section'
import { NavHeaderType } from '~/components/NavigationHeader'

const FAQ = () => {
  const listRef = useRef<FlatList>(null)
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

  const handleExpand = (ref: React.RefObject<FlatList>, index: number) => {
    // eslint-disable-next-line
    listRef.current?.scrollToIndex({
      index,
      //NOTE: attempts to center the view
      viewPosition: 0.5,
    })
  }

  function renderTitle() {
    return (
      <CollapsibleClone.Title text={t('FAQ.header')}>
        <Section.Title>{t('FAQ.header')}</Section.Title>
      </CollapsibleClone.Title>
    )
  }

  return (
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
        paddingHorizontal: 0,
        flex: 1,
      }}
    >
      <CollapsibleClone
        renderHeader={() => (
          <CollapsibleClone.Header type={NavHeaderType.Back} />
        )}
        renderScroll={({ headerHeight, onScroll, onSnap }) => (
          <ScreenContainer.Padding>
            <Animated.FlatList
              ref={listRef}
              ListHeaderComponent={renderTitle()}
              data={faqArray}
              overScrollMode={'never'}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingTop: headerHeight,
              }}
              renderItem={({
                item,
                index,
              }: {
                item: TFAQItem
                index: number
              }) => (
                <BlockExpanded
                  key={index}
                  title={item.question}
                  expandedText={item.answer}
                  onExpand={() => handleExpand(listRef, index)}
                />
              )}
              onScroll={onScroll}
              onScrollEndDrag={(e: NativeSyntheticEvent<NativeScrollEvent>) =>
                onSnap(e, listRef)
              }
              keyExtractor={(_: TFAQItem, index: number) => index.toString()}
            />
          </ScreenContainer.Padding>
        )}
      />
    </ScreenContainer>
  )
}

export default FAQ
