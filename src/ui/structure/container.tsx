import React, { ReactNode } from 'react'
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native'

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
  children: ReactNode
  style?: StyleProp<ViewStyle>
}

export const Container: React.FC<Props> = props => (
  <View style={[styles.container, props.style]}>{props.children}</View>
)
