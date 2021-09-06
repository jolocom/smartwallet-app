import React from 'react'
import { useMemo } from 'react'
import { Animated, StyleSheet } from 'react-native'
import NavigationHeader from '~/components/NavigationHeader'
import { Colors } from '~/utils/colors'
import { useCollapsible } from './context'
import { ICollapsibleComposite } from './types'

/**
 *
 * Header component of Collapsible is responsible for:
 * -> displaying text of the current title, which is a title that changes
 * on scroll
 * -> changing opacity of the header text when scrolling
 */
const Header: ICollapsibleComposite['Header'] = ({ type, onPress }) => {
  const { currentTitleText, scrollY, currentTitle } = useCollapsible()
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

  const headerTitlePosition = useMemo(() => {
    if (currentTitle === undefined) return 0
    return scrollY.interpolate({
      inputRange: [
        (currentTitle.startY + currentTitle.endY) / 2,
        currentTitle.endY,
      ],
      outputRange: [30, 0],
      extrapolate: 'clamp',
    })
  }, [JSON.stringify(currentTitle)])

  return (
    <NavigationHeader
      type={type}
      customStyles={styles.container}
      onPress={onPress}
    >
      <Animated.Text
        numberOfLines={1}
        style={[
          styles.text,
          type === undefined && { textAlign: 'center' },
          {
            opacity: headerTitleOpacity,
            transform: [
              {
                translateY: headerTitlePosition,
              },
            ],
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
    backgroundColor: Colors.mainBlack,
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
})

export default Header