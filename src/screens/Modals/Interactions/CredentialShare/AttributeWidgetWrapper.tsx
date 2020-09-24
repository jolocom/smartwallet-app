import React from 'react'
import { View, StyleSheet, StyleProp, ViewProps } from 'react-native'
import { Colors } from '~/utils/colors'

const AttributeWidgetWrapper: React.FC<{
  customStyles?: StyleProp<ViewProps>
}> = ({ children, customStyles }) => (
  <View style={[styles.wrapper, customStyles]}>{children}</View>
)

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 17,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: Colors.lightBlack,
    borderRadius: 20,
    marginBottom: 46,
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
