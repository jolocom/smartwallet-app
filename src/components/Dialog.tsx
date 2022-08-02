import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'

interface Props {
  onPress: () => void
}

const Dialog: React.FC<Props> = ({ children, onPress }) => {
  return (
    <TouchableOpacity
      testID="dialog"
      style={styles.container}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 7,
    paddingTop: 11,
    paddingBottom: 13,
    paddingHorizontal: 12,
    backgroundColor: Colors.black30,
    width: '100%',
    marginHorizontal: BP({ xsmall: 12, default: 24 }),
  },
})

export default Dialog
