import React from 'react'
import { Animated, FlatList } from 'react-native'
import { useCollapsible } from '../context'
import { IFlatListProps } from '../types'
import { HidingTextContainer } from './HidingTextContainer'

// FIXME: the types are all messed up
export const CollapsibleFlatList = React.forwardRef<
  Animated.AnimatedComponent<typeof FlatList>,
  IFlatListProps
>(
  (
    { animatedHeader = false, customStyles = {}, renderHidingText, ...props },
    ref,
  ) => {
    const { handleScroll, headerHeight } = useCollapsible()

    return (
      <Animated.FlatList
        contentContainerStyle={[customStyles]}
        ListHeaderComponent={() => (
          <HidingTextContainer customStyles={{ marginTop: headerHeight }}>
            {renderHidingText()}
          </HidingTextContainer>
        )}
        // @ts-ignore
        ref={ref}
        // @ts-ignore
        keyExtractor={(item, index) => index.toString()}
        {...props}
        onScroll={handleScroll}
      />
    )
  },
)
