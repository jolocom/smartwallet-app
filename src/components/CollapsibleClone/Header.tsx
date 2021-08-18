import React from 'react'
import { useMemo } from 'react'
import { Animated, StyleSheet } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'
import { Colors } from '~/utils/colors'
import { useCollapsibleClone } from './context'

/**
 *
 * Header component of CollapsibleClone is responsible for:
 * -> displaying text of the current title, which is a title that changes
 * on scroll
 * -> changing opacity of the header text when scrolling
 */
const Header: React.FC = () => {
  const { currentTitleText, scrollY, currentTitle } = useCollapsibleClone()
  const headerTitleOpacity = useMemo(() => {
    if (currentTitle === undefined) return 0
    return scrollY.interpolate({
      inputRange: [
        (currentTitle.startY + currentTitle.endY) / 2,
        currentTitle.endY,
      ],
      outputRange: [0, 1],
    })
  }, [JSON.stringify(currentTitle)])

  const { top } = useSafeArea()

  return (
    <NavigationHeader
      type={NavHeaderType.Back}
      customStyles={[styles.container, { paddingTop: top, height: 50 + top }]}
    >
      <Animated.Text
        numberOfLines={1}
        style={[
          styles.text,
          {
            flex: 0.5,
            opacity: headerTitleOpacity,
          },
        ]}
      >
        {currentTitleText}
      </Animated.Text>
    </NavigationHeader>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.mainBlack,
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
})

export default Header
