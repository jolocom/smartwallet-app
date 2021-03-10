import React, { useRef } from 'react'
import { FlatList, FlatListProps, Animated } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import BlockExpanded from '~/components/BlockExpanded'
import Section from './components/Section'
// @ts-ignore
import faqJson from '~/translations/faq.json'
import { strings } from '~/translations/strings'
import { useCollapsible } from '~/components/Collapsible/context'
import Collapsible from '~/components/Collapsible'
import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'

type FAQArray = Array<{ question: string; answer: string }>

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)
const CollapsibleFlatList = React.forwardRef<FlatList, FlatListProps<any>>(
  ({ ...props }, ref) => {
    const { handleScroll } = useCollapsible()

    return <AnimatedFlatList ref={ref} {...props} onScroll={handleScroll} />
  },
)

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
        <Collapsible.ScrollView>
          <Collapsible.HidingTextContainer>
            <Section.Title>{strings.POPULAR_QUESTIONS}</Section.Title>
          </Collapsible.HidingTextContainer>
          <FlatList
            ref={flatlistRef}
            data={faqArray}
            overScrollMode={'never'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 40,
            }}
            style={{ width: '100%' }}
            renderItem={({ item, index }) => (
              <BlockExpanded
                key={index}
                title={item.question}
                expandedText={item.answer}
                onExpand={() => handleExpand(index)}
              />
            )}
          />
        </Collapsible.ScrollView>
      </ScreenContainer>
    </Collapsible>
  )
}

export default FAQ
