import React, { ReactNode } from 'react'
import {
  StyleSheet,
  ViewStyle,
  StyleProp,
  SafeAreaView,
  View,
} from 'react-native'

/**
 * Container
 *
 * The main use for this component is to have a full height and width component
 * that can be used in different components. It should be minimal in its style
 * so as to be reusable without constant overriding of its defaults.
 */

const styles = StyleSheet.create({
  container: {
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
  safeArea?: boolean
}

export const Container: React.FC<Props> = props => {
  const ContainerView = !!props.safeArea ? View : SafeAreaView

  return (
    <ContainerView
      testID={props.testID}
      style={[styles.container, props.style]}
    >
      {props.children}
    </ContainerView>
  )
}
