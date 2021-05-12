import React from 'react'
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native'
import { BIOMETRY_TYPE } from 'react-native-keychain'
import { TouchIdIcon, FaceIdIcon } from '~/assets/svg'

import Ripple from '~/components/Ripple'

import { Colors } from '~/utils/colors'
import { BiometryTypes } from '~/screens/Modals/DeviceAuthentication/module/deviceAuthTypes'

interface PropsI {
  biometryType: BiometryTypes
  handleAuthenticate: () => void
  customStyles?: ViewStyle
}

const BiometryAnimation: React.FC<PropsI> = ({
  biometryType,
  handleAuthenticate,
  customStyles,
}) => {
  const isFaceBiometry =
    biometryType === BIOMETRY_TYPE.FACE_ID || biometryType === 'FACE'
  return (
    <TouchableOpacity
      onPress={handleAuthenticate}
      style={[styles.animationContainer, customStyles]}
    >
      <View style={styles.ripple}>
        <Ripple
          color={Colors.activity}
          initialValue1={5}
          maxValue1={15}
          maxValue2={15}
        />
      </View>
      {isFaceBiometry ? <FaceIdIcon /> : <TouchIdIcon />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  animationContainer: {
    marginTop: '40%',
    marginBottom: '30%',
  },
  ripple: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default BiometryAnimation
