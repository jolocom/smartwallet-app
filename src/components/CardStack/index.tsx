import React, { useState } from 'react'
import Animated, {
  runOnJS,
  useAnimatedScrollHandler
} from 'react-native-reanimated'
import { StackItem, StackItemConfig } from './StackItem'

export interface StackData<T extends { id: string }> {
  stackId: string
  data: T[]
}

export interface StackScrollViewProps<T extends { id: string }>
  extends StackItemConfig {
  data: StackData<T>[]
  renderStack: (data: StackData<T>, item: React.ReactNode) => React.ReactNode
  renderItem: (data: T, i: number) => React.ReactNode
}

interface ExpandState {
  stackId: string
  itemId: string
}

export const StackScrollView = <T extends { id: string }>({
  data,
  renderItem,
  renderStack,
  ...itemConfig
}: StackScrollViewProps<T>) => {
  const [expandState, setExpandState] = useState<ExpandState | null>(null)

  const resetStack = () => {
    setExpandState(null)
  }

  const scrollHandler = useAnimatedScrollHandler(
    {
      onBeginDrag: () => {
        if (expandState) {
          runOnJS(resetStack)()
        }
      },
    },
    [JSON.stringify(expandState)],
  )

  const handlePress = (item: ExpandState) => {
    setExpandState(item)
  }

  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      //ref={scrollRef}
      scrollEventThrottle={4}
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingVertical: 40,
        paddingBottom: 400,
        width: '100%',
        paddingTop: 80,
        alignItems: 'center',
      }}
    >
      {data.map((stack) => {
        const renderStackChildren = () => {
          return stack.data.map((item, i) => {
            let isExpanded = false

            const prevItem = stack.data[i - 1]

            if (expandState && expandState.stackId === stack.stackId) {
              if (prevItem && expandState.itemId === prevItem.id) {
                isExpanded = true
              }
            }
            return (
              <StackItem
                id={item.id}
                index={i}
                onPress={() => {
                  handlePress({ stackId: stack.stackId, itemId: item.id })
                }}
                isExpanded={isExpanded}
                {...itemConfig}
              >
                {renderItem(item, i)}
              </StackItem>
            )
          })
        }

        return renderStack(stack, renderStackChildren())
      })}
    </Animated.ScrollView>
  )
}
