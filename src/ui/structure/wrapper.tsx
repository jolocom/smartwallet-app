import React, { ReactNode } from 'react'
import {
  StyleSheet,
  ViewStyle,
  StyleProp,
  SafeAreaView,
  View,
} from 'react-native'

/**
 * Wrapper
 *
 * The main use for this component is to have a full height and width component
 * that can be used in different components. It should be minimal in its style
 * so as to be reusable without constant overriding of its defaults.
 *
 * NOTE: If the wrapper is used with SafeAreaView, the padding style prop passed to
 * it will be ignored on iOS. https://github.com/facebook/react-native/issues/22211
 */

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
})

interface Props {
  testID?: string
  children: ReactNode
  style?: StyleProp<ViewStyle>
  withoutSafeArea?: boolean
}

export const Wrapper: React.FC<Props> = props => {
  const WrapperView = props.withoutSafeArea ? View : SafeAreaView

  return (
    <WrapperView testID={props.testID} style={[styles.wrapper, props.style]}>
      {props.children}
    </WrapperView>
  )
}
