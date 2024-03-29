import React from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { FingerprintIcon, FaceIdIcon } from '~/assets/svg'
import { IWithCustomStyle } from '~/types/props'
import Ripple from '~/components/Ripple'
import { Colors } from '~/utils/colors'
import { BiometryTypes } from '~/screens/Modals/WalletAuthentication/module/walletAuthTypes'
import LinearGradient from 'react-native-linear-gradient'

interface PropsI extends IWithCustomStyle {
  biometryType: BiometryTypes
  handleAuthenticate: () => void
}

const BiometryAnimation: React.FC<PropsI> = ({
  biometryType,
  handleAuthenticate,
  customStyles,
}) => {
  const isFaceBiometry =
    biometryType === BiometryTypes.FaceID || biometryType === BiometryTypes.Face
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
      <LinearGradient
        style={styles.gradient}
        colors={[Colors.ceriseRed, Colors.disco]}
      >
        <View style={styles.button}>
          {isFaceBiometry ? <FaceIdIcon /> : <FingerprintIcon />}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  gradient: {
    width: 75,
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 75 / 2,
  },
  button: {
    width: 40,
    height: 40,
  },
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
