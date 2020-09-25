import React from 'react'
import { View, StyleSheet, StyleProp, ViewProps } from 'react-native'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { FAS_PADDING } from '../consts'

const AttributeWidgetWrapper: React.FC<{
  customStyles?: StyleProp<ViewProps>
}> = ({ children, customStyles }) => (
  <View style={[styles.wrapper, customStyles]}>{children}</View>
)

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: FAS_PADDING,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: Colors.lightBlack,
    borderRadius: 20,
    marginBottom: BP({ large: 36, medium: 36, small: 24, xsmall: 24 }),
    // Shadows
    shadowColor: Colors.black50,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowRadius: 14,
    shadowOpacity: 1,
    elevation: 10,
  },
})

export default AttributeWidgetWrapper
