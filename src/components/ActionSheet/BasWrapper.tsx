import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { Colors } from '~/utils/colors'
import InteractionHeader from '~/screens/Modals/Interactions/InteractionHeader'
import InteractionFooter from '~/screens/Modals/Interactions/InteractionFooter'

const BasWrapper: React.FC<{
  onSubmit?: () => void
  customStyle?: ViewStyle
}> = ({ children, onSubmit, customStyle = {} }) => {
  return (
    <View style={[styles.wrapper, customStyle]}>
      <InteractionHeader />
      {children}
      {onSubmit && <InteractionFooter onSubmit={onSubmit} />}
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
