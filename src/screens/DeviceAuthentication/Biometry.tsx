import React from 'react'
import { BIOMETRY_TYPE } from 'react-native-keychain'
import {
  View,
  Alert,
  Linking,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import FingerprintScanner from 'react-native-fingerprint-scanner'
import { useDispatch } from 'react-redux'

import ScreenContainer from '~/components/ScreenContainer'
import Header, { HeaderSizes } from '~/components/Header'
import Paragraph from '~/components/Paragraph'
import Btn, { BtnTypes } from '~/components/Btn'
import Ripple from '~/components/Ripple'
import AbsoluteBottom from '~/components/AbsoluteBottom'

import { strings } from '~/translations/strings'

import TouchIdIcon from '~/assets/svg/TouchIdIcon'
import FaceIdIcon from '~/assets/svg/FaceIdIcon'

import useRedirectTo from '~/hooks/useRedirectTo'
import useSuccess from '~/hooks/useSuccess'

import { Colors } from '~/utils/colors'

import { ScreenNames } from '~/types/screens'

import { useDeviceAuthState } from './module/deviceAuthContext'

import {
  getBiometryHeader,
  getBiometryActionText,
  getBiometryIsDisabledText,
  getBiometryDescription,
} from './utils/getText'
import { setLogged } from '~/modules/account/actions'
import useDelay from '~/hooks/useDelay'

const Biometry: React.FC = () => {
  const { biometryType } = useDeviceAuthState()
  const displaySuccessLoader = useSuccess()
  const dispatch = useDispatch()
  const redirectToLoggedIn = useRedirectTo(ScreenNames.LoggedIn)

  const isFaceBiometry =
    biometryType === BIOMETRY_TYPE.FACE_ID || biometryType === 'FACE'

  // 🗑 temporarily solution
  // there will be no need to redirect to logged in section
  // as DeviceAuth will be displayed out of Logged in Section
  const handleLogin = async () => {
    dispatch(setLogged(true))
    await useDelay(redirectToLoggedIn, 100)
  }

  const authenticate = async () => {
    try {
      await FingerprintScanner.authenticate({
        description: getBiometryDescription(biometryType),
        fallbackEnabled: false, // on this stage we don't want to prompr use passcode as a fallback
      })

      await AsyncStorage.setItem('biometry', biometryType || '')
      // handleBiometryRegistration();

      await displaySuccessLoader()
      handleLogin()
    } catch (err) {
      if (err.name === 'FingerprintScannerNotEnrolled') {
        Alert.alert(
          getBiometryIsDisabledText(biometryType),
          strings.TO_USE_BIOMETRICS_ENABLE,
          [
            {
              text: strings.SETTINGS,
              onPress: () => Linking.openSettings(),
            },
            {
              text: strings.CANCEL,
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
          ],
          { cancelable: false },
        )
      }
    }
  }

  return (
    <ScreenContainer customStyles={{ justifyContent: 'flex-start' }}>
      <View>
        <Header size={HeaderSizes.small}>
          {getBiometryHeader(biometryType)}
        </Header>
        <Paragraph color={Colors.white70}>
          {strings.SO_YOU_DONT_NEED_TO_CONFIRM}
        </Paragraph>
      </View>
      <TouchableOpacity
        onPress={authenticate}
        style={styles.animationContainer}
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
      <Paragraph
        color={Colors.success}
        customStyles={{ paddingHorizontal: 25 }}
      >
        {getBiometryActionText(biometryType)}
      </Paragraph>
      <AbsoluteBottom>
        <Btn type={BtnTypes.secondary} onPress={handleLogin}>
          {strings.SKIP}
        </Btn>
      </AbsoluteBottom>
    </ScreenContainer>
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

export default Biometry
