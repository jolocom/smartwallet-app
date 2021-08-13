import React from 'react'
import { Animated, StyleSheet } from 'react-native'
import NavigationHeader, { NavHeaderType } from '~/components/NavigationHeader'
import { Colors } from '~/utils/colors'
import { useCollapsibleClone } from './context'

const Header: React.FC = () => {
  const { currentTitleText, scrollY, currentTitle, headerHeight } =
    useCollapsibleClone()

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [
      currentTitle?.startY ? currentTitle.startY : 0,
      currentTitle?.endY ? currentTitle.endY : headerHeight,
    ],
    outputRange: [0, 1],
  })

  return (
    <NavigationHeader type={NavHeaderType.Back} customStyles={styles.container}>
      <Animated.Text
        numberOfLines={1}
        style={[styles.text, { flex: 0.5, opacity: headerTitleOpacity }]}
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
    backgroundColor: Colors.mainBlack,
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
})

export default Header
