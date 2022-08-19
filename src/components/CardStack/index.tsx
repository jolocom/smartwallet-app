import React, { useCallback, useState } from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated'
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
  data: StackData<T, P>[]
  renderStack: (data: StackData<T>, item: React.ReactNode) => React.ReactNode
  renderItem: (
    data: T,
    stack: StackData<T>,
    visible: boolean,
  ) => React.ReactNode
}

export const StackScrollView = <T extends { id: string }, P extends {}>({
  data,
  renderItem,
  renderStack,
  ...itemConfig
}: StackScrollViewProps<T, P>) => {
  const expandValue = useSharedValue<ExpandState | null>(null)
  // NOTE: Only reason it's here is to force re-renders when needed
  const [expandState, setExpandState] = useState(expandValue.value)

  // NOTE: We are converting the animated expand state to React's state to make sure the StackItem is re-rendered
  // when the expand state changes. Nevertheless, the StackItem should only receive the animated expand state in
  // order for the animations to run smoothly.
  useAnimatedReaction(
    () => {
      return (
        expandValue.value?.itemId !== expandState?.itemId ||
        expandValue.value?.stackId !== expandState?.stackId
      )
    },
    (changed) => {
      if (changed) {
        runOnJS(setExpandState)(expandValue.value)
      }
    },
  )

  const handlePress = (item: ExpandState) => {
    expandValue.value = item
  }

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {
      if (expandValue.value) {
        expandValue.value = null
      }
    },
  })

  const renderStackItem = useCallback(
    (item: T, i: number, stack: StackData<T>) => {
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
    },
    [expandState?.itemId, expandState?.stackId],
  )

  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      scrollEventThrottle={4}
      style={styles.scroll}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
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
