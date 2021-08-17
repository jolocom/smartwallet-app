import React from 'react'
import { useMemo } from 'react'
import { Animated, StyleSheet } from 'react-native'
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
      inputRange: [currentTitle.startY / 2, currentTitle.endY],
      outputRange: [0, 1],
    })
  }, [JSON.stringify(currentTitle)])

  return (
    <NavigationHeader type={NavHeaderType.Back} customStyles={styles.container}>
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
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white21,
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
})

export default Header
