import { NavigationRoute, TabScene } from 'react-navigation'
import React from 'react'
import { Colors } from '../../../styles'
// @ts-ignore
import CrossFadeIcon from 'react-navigation-tabs/src/views/CrossFadeIcon'
import { AccessibilityRole, AccessibilityState, Animated, StyleSheet, TouchableOpacity } from 'react-native'
import { fontLight } from '../../../styles/typography'

const styles = StyleSheet.create({
  label: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontSize: 12,
    fontFamily: fontLight,
    marginTop: 15,
    marginBottom: '16%',
  },
  button: {
    zIndex: 4,
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
})

interface Props {
  testID: string
  focused: boolean
  route: NavigationRoute
  renderIcon: (scene: TabScene) => React.ReactNode
  onTabPress: () => void
  label: string
  accessibility: {
    label: string,
    role: AccessibilityRole,
    states: AccessibilityState[],
  }
}
export const TabButton = (props: Props) => {
  const { focused, route, renderIcon, onTabPress, label, testID, accessibility } = props

  const activeOpacity = focused ? 1 : 0
  const inactiveOpacity = focused ? 0 : 1

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onTabPress}
      onLongPress={onTabPress}
      style={styles.button}
      accessibilityLabel={accessibility.label}
      accessibilityRole={accessibility.role}
      accessibilityStates={accessibility.states}
    >
      <CrossFadeIcon
        route={route}
        activeOpacity={activeOpacity}
        inactiveOpacity={inactiveOpacity}
        activeTintColor={Colors.white}
        inactiveTintColor={Colors.gray151}
        horizontal={false}
        renderIcon={renderIcon}
      />
      <Animated.Text
        numberOfLines={1}
        style={[
          styles.label,
          { color: focused ? Colors.white : Colors.white050 },
        ]}
        allowFontScaling={true}
      >
        {label}
      </Animated.Text>
    </TouchableOpacity>
  )
}
