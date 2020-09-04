import React from 'react'
import { View, StyleSheet, ViewStyle, KeyboardAvoidingView } from 'react-native'
import { Colors } from '~/utils/colors'
import InteractionHeader from '~/screens/Modals/Interactions/InteractionHeader'
import InteractionFooter from '~/screens/Modals/Interactions/InteractionFooter'

const BasWrapper: React.FC<{
  customStyle?: ViewStyle
  withFooter?: boolean
}> = ({ children, customStyle = {}, withFooter = true }) => {
  return (
    <KeyboardAvoidingView style={[styles.wrapper, customStyle]}>
      <InteractionHeader />
      <View style={{ paddingTop: 28 }}>{children}</View>
      {withFooter && <InteractionFooter />}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: Colors.lightBlack,
    borderRadius: 20,
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    paddingTop: 55,
  },
})

export default BasWrapper
