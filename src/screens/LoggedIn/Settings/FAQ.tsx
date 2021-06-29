import React from 'react'
import {
  Animated,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import BlockExpanded from '~/components/BlockExpanded'
// @ts-ignore
import faqJson from '~/translations/faq.json'
import { strings } from '~/translations/strings'
import CollapsibleClone from '~/components/CollapsibleClone'
import { useRef } from 'react'

type TFAQItem = { question: string; answer: string }
type FAQArray = Array<TFAQItem>

// TODO: FAQ isn't snapping correctly
const FAQ = () => {
  const listRef = useRef<FlatList>(null)
  const faqArray = faqJson as FAQArray

  const handleExpand = (ref: React.RefObject<FlatList>, index: number) => {
    listRef.current?.scrollToIndex({
      index,
      //NOTE: attempts to center the view
      viewPosition: 0.5,
    })
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
        renderHeader={() => <CollapsibleClone.Header />}
        renderScroll={({ headerHeight, onScroll, onSnap }) => (
          <ScreenContainer.Padding>
            <Animated.FlatList
              ref={listRef}
              ListHeaderComponent={() => (
                <CollapsibleClone.Title text={strings.POPULAR_QUESTIONS} />
              )}
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
