import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { Colors } from '~/utils/colors'
import InteractionHeader from '~/screens/Modals/Interactions/InteractionHeader'
import InteractionFooter from '~/screens/Modals/Interactions/InteractionFooter'

const BasWrapper: React.FC<{
  customStyle?: ViewStyle
}> = ({ children, customStyle = {} }) => {
  return (
    <View style={[styles.wrapper, customStyle]}>
      <InteractionHeader />
      <View
        style={{
          marginTop: children ? 28 : 5,
          marginBottom: 28,
          alignItems: 'center',
        }}
      >
        {children}
      </View>

      <InteractionFooter />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: Colors.black,
    borderRadius: 20,
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    paddingTop: 55,
  },
})

export default BasWrapper
