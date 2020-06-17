import React from 'react'
import { View, StyleSheet } from 'react-native'
import CloseIcon from '~/assets/svg/CloseIcon'
import { TouchableOpacity } from 'react-native-gesture-handler'
import useNavigateBack from '~/hooks/useNavigateBack'

const NavigationHeader = () => {
  const navigateBack = useNavigateBack()

  return (
    <View style={styles.navContainer}>
      <TouchableOpacity
        // TODO replace with @Btn (add customContainerStyles prop)
        style={styles.button}
        onPress={navigateBack}
      >
        <CloseIcon />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  navContainer: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
  },
  button: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default NavigationHeader
