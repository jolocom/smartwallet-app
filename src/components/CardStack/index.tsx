import React, { useCallback } from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated'
import { ExpandState, StackItem, StackItemConfig } from './StackItem'

export interface StackData<T extends { id: string }> {
  stackId: string
  data: T[]
}

export interface StackScrollViewProps<T extends { id: string }>
  extends StackItemConfig {
  data: StackData<T>[]
  renderStack: (data: StackData<T>, item: React.ReactNode) => React.ReactNode
  renderItem: (data: T, visible: boolean) => React.ReactNode
}

export const StackScrollView = <T extends { id: string }>({
  data,
  renderItem,
  renderStack,
  ...itemConfig
}: StackScrollViewProps<T>) => {
  const expandState = useSharedValue<ExpandState | null>(null)

  const resetStack = () => {
    expandState.value = null
  }

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
    >
      {data.map((stack) => {
        const renderStackChildren = () => {
          return stack.data.map((item, i) => renderStackItem(item, i, stack))
        }

        return renderStack(stack, renderStackChildren())
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
