import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated'
import { DocumentStacks } from '~/modules/credentials/types'
import { ExpandState, StackItem, StackItemConfig } from './StackItem'

export interface StackData<T extends { id: string }, P extends {} = {}> {
  stackId: string
  data: T[]
  extra: P
}

export interface StackScrollViewProps<
  T extends { id: string },
  P extends {} = {},
> extends StackItemConfig {
  prevAdded?: string | undefined
  data: StackData<T, P>[]
  renderStack: (data: StackData<T>, item: React.ReactNode) => React.ReactNode
  renderItem: (
    data: T,
    stack: StackData<T>,
    visible: boolean,
  ) => React.ReactNode
}

export const StackScrollView = <T extends { id: string }, P extends {}>({
  prevAdded,
  data,
  renderItem,
  renderStack,
  ...itemConfig
}: StackScrollViewProps<T, P>) => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>()

  const expandValue = useSharedValue<ExpandState | null>(null)
  // NOTE: Only reason it's here is to force re-renders when needed
  const [expandState, setExpandState] = useState(expandValue.value)

  useEffect(() => {
    if (prevAdded)
      expandValue.value = { itemId: prevAdded, stackId: DocumentStacks.All }
  }, [prevAdded])

  // NOTE: We are converting the animated expand state to React's state to make sure the StackItem is re-rendered
  // when the expand state changes. Nevertheless, the StackItem should only receive the animated expand state in
  // order for the animations to run smoothly.
  useAnimatedReaction(
    () => {
      const changed =
        expandValue.value?.itemId !== expandState?.itemId ||
        expandValue.value?.stackId !== expandState?.stackId
      const expanded =
        expandValue.value?.itemId !== undefined &&
        expandState?.itemId === undefined
      const collapsed =
        expandValue.value?.itemId === undefined &&
        (expandState?.itemId !== undefined) !== undefined

      return { changed, expanded, collapsed }
    },
    ({ changed }) => {
      if (changed) {
        runOnJS(setExpandState)(expandValue.value)
      }
    },
  )

  const handlePress = (item: ExpandState) => {
    expandValue.value = item
  }

  const scrollHandler = useAnimatedScrollHandler<{
    isScrolling: boolean
    lastContentOffset: number
  }>({
    onBeginDrag: (_, ctx) => {
      ctx.isScrolling = true
    },
    onEndDrag: (_, ctx) => {
      ctx.isScrolling = false
    },
    onScroll: (e, ctx) => {
      if (ctx.lastContentOffset > e.contentOffset.y) {
        if (expandValue.value) {
          expandValue.value = null
        }
      }
      ctx.lastContentOffset = e.contentOffset.y
    },
  })

  const renderStackItem = (item: T, i: number, stack: StackData<T>) => {
    const prevItem = stack.data[i - 1]
    const lastItem = stack.data[stack.data.length - 1]

    // NOTE: The last card in the stack is always "visible". Furthermore,
    // the card is visibile when it's expanded as well.
    const visible = expandState?.itemId === item.id || item.id === lastItem.id
    return (
      <StackItem
        key={item.id}
        stackId={stack.stackId}
        index={i}
        onPress={() => {
          handlePress({ stackId: stack.stackId, itemId: item.id })
        }}
        prevItemId={prevItem?.id}
        expandState={expandValue}
        {...itemConfig}
      >
        {renderItem(item, stack, visible)}
      </StackItem>
    )
  }

  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      scrollEventThrottle={4}
      style={styles.scroll}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      ref={scrollRef}
    >
      {data.map((stack) => {
        const renderStackChildren = () => {
          return stack.data.map((item, i) => (
            <React.Fragment key={item.id}>
              {renderStackItem(item, i, stack)}
            </React.Fragment>
          ))
        }

        return (
          <React.Fragment key={stack.stackId}>
            {renderStack(stack, renderStackChildren())}
          </React.Fragment>
        )
      })}
    </Animated.ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 40,
    paddingBottom: 100,
    width: '100%',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
})
