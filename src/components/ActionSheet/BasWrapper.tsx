import React, { useEffect, useRef } from 'react'
import { View, StyleSheet, ViewStyle, Platform, Animated } from 'react-native'
import { Colors } from '~/utils/colors'
import BP from '~/utils/breakpoints'

import InteractionIcon, { IconWrapper } from './InteractionIcon'
import { useSafeArea } from 'react-native-safe-area-context'
import { useKeyboardHeight } from '~/hooks/useKeyboardHeight'

interface Props {
  customStyles?: ViewStyle
  showIcon?: boolean
}

export const BasInteractionBody: React.FC = ({ children }) => (
  <View style={styles.interactionBody}>{children}</View>
)

const BasWrapper: React.FC<Props> = ({
  children,
  customStyles = {},
  //NOTE: currently only the @IntermediarySheetBody doesn't render the counterparty icon
  showIcon = true,
}) => {
  const { bottom } = useSafeArea()
  const { keyboardHeight } = useKeyboardHeight(0)
  const bottomPosition = keyboardHeight ? keyboardHeight + 5 : bottom + 5

  const animatedOpacity = useRef(
    new Animated.Value(showIcon || Platform.OS === 'android' ? 1 : 0),
  ).current

  useEffect(() => {
    if (keyboardHeight && Platform.OS !== 'android') {
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start()
    }
  }, [keyboardHeight])

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { bottom: Platform.OS === 'ios' ? bottomPosition : bottom + 5 },
        { opacity: animatedOpacity },
      ]}
    >
        {showIcon && (
          <IconWrapper customStyle={{ marginBottom: -35 }}>
            <View style={styles.basIcon}>
              <InteractionIcon />
            </View>
          </IconWrapper>
        )}
        <View style={[styles.childrenWrapper, customStyles]}>{children}</View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '98%',
  },
  basIcon: {
    position: 'absolute',
    top: 0,
    zIndex: 2,
  },
  childrenWrapper: {
    width: '100%',
    backgroundColor: Colors.codGrey,
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: BP({ large: 48, medium: 48, default: 44 }),
    paddingBottom: BP({ large: 36, medium: 36, default: 24 }),
  },
  interactionBody: {
    marginBottom: BP({ default: 50, xsmall: 40 }),
    width: '100%',
    alignItems: 'center',
  },
})

export default BasWrapper
