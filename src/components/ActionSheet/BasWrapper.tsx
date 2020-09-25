import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { Colors } from '~/utils/colors'
import InteractionHeader from '~/screens/Modals/Interactions/InteractionHeader'
import InteractionFooter from '~/screens/Modals/Interactions/InteractionFooter'
import BP from '~/utils/breakpoints'

const BasWrapper: React.FC<{
  customStyle?: ViewStyle
  withFooter?: boolean
}> = ({ children, customStyle = {}, withFooter = true }) => {
  return (
    <View style={[styles.wrapper, customStyle]}>
      <InteractionHeader />
      <View style={styles.childrenWrapper}>{children}</View>

      {withFooter && <InteractionFooter />}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: Colors.codGrey,
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: BP({ large: 48, medium: 48, small: 44, xsmall: 44 }),
    paddingBottom: BP({ large: 36, medium: 36, small: 24, xsmall: 24 }),
  },
  childrenWrapper: {
    alignItems: 'center',
  },
})

export default BasWrapper
