import React, { useRef } from 'react'
import {
  Animated,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native'

import BlockExpanded from '~/components/BlockExpanded'
import Collapsible from '~/components/Collapsible'
import { NavHeaderType } from '~/components/NavigationHeader'
import ScreenContainer from '~/components/ScreenContainer'
import useTranslation from '~/hooks/useTranslation'
import Section from './components/Section'

type TFAQItem = { question: string; answer: string }

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
      <Collapsible.Title text={t('FAQ.header')}>
        <Section.Title>{t('FAQ.header')}</Section.Title>
      </Collapsible.Title>
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
      <Collapsible
        renderHeader={() => <Collapsible.Header type={NavHeaderType.Back} />}
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
                  hasDropdown={true}
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
