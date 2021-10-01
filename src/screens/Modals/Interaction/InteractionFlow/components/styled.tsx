import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { SCREEN_HEIGHT } from '~/utils/dimensions'

export const ContainerBAS: React.FC = ({ children }) => {
  const { bottom } = useSafeArea()
  const positionValue = useRef(new Animated.Value(SCREEN_HEIGHT)).current

  const animatePosition = (value: number) => {
    Animated.timing(positionValue, {
      duration: 400,
      toValue: value,
      useNativeDriver: true,
    }).start()
  }

  useEffect(() => {
    animatePosition(0)

    return () => {
      animatePosition(SCREEN_HEIGHT)
    }
  }, [])

  return (
    <Animated.View
      style={[
        styles.containerBAS,
        { marginBottom: 10 + bottom },
        { transform: [{ translateY: positionValue }] },
      ]}
    >
      {children}
    </Animated.View>
  )
}

export const LogoContainerBAS: React.FC = ({ children }) => (
  <View style={styles.logoContainerBAS}>{children}</View>
)

export const ContainerFAS: React.FC = ({ children }) => (
  <View style={styles.containerFAS} children={children} />
)

export const LogoContainerFAS: React.FC = ({ children }) => {
  return <View style={[styles.logoContainerFAS]}>{children}</View>
}

export const FooterContainerFAS: React.FC = ({ children }) => {
  const { bottom } = useSafeArea()
  return (
    <View
      style={[styles.footerContainerFAS, { paddingBottom: bottom }]}
      children={children}
    />
  )
}

export const Space = ({ height = 48 }) => <View style={{ height }} />

const styles = StyleSheet.create({
  containerBAS: {
    width: '96%',
    backgroundColor: Colors.codGrey,
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: BP({ large: 48, medium: 48, default: 44 }),
    paddingBottom: BP({ large: 36, medium: 36, default: 24 }),
  },
  containerFAS: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors.mainBlack,
  },
  logoContainerBAS: {
    position: 'absolute',
    top: -35,
    alignSelf: 'center',
  },
  logoContainerFAS: {
    alignItems: 'center',
  },
  footerContainerFAS: {
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    height: 106,
    backgroundColor: Colors.black,
    borderTopRightRadius: 22,
    borderTopLeftRadius: 22,
    paddingHorizontal: '5%',
    shadowColor: Colors.black30,
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowRadius: 7,
    shadowOpacity: 1,
    elevation: 10,
  },
})
