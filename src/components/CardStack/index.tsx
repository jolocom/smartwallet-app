import React, { useCallback } from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
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
  renderItem: (data: T, visible: boolean) => React.ReactNode
}

export const StackScrollView = <T extends { id: string }, P extends {}>({
  data,
  renderItem,
  renderStack,
  ...itemConfig
}: StackScrollViewProps<T, P>) => {
  const expandState = useSharedValue<ExpandState | null>(null)

  const handlePress = (item: ExpandState) => {
    expandState.value = item
  }

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {
      if (expandState.value) {
        expandState.value = null
      }
    },
  })

  const renderStackItem = useCallback(
    (item: T, i: number, stack: StackData<T>) => {
      const prevItem = stack.data[i - 1]

      const visible = expandState.value?.itemId === item.id
      return (
        <StackItem
          key={item.id}
          stackId={stack.stackId}
          index={i}
          onPress={() => {
            handlePress({ stackId: stack.stackId, itemId: item.id })
          }}
          prevItemId={prevItem?.id}
          expandState={expandState}
          {...itemConfig}
        >
          {renderItem(item, visible)}
        </StackItem>
      )
    },
    [expandState],
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
