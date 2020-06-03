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

import ScreenContainer from '~/components/ScreenContainer'
import Header, { HeaderSizes } from '~/components/Header'
import Paragraph from '~/components/Paragraph'
import Btn, { BtnTypes } from '~/components/Btn'
import BtnGroup from '~/components/BtnGroup'
import Ripple from '~/components/Ripple'

import { strings } from '~/translations/strings'

import TouchIdIcon from '~/assets/svg/TouchIdIcon'
import FaceIdIcon from '~/assets/svg/FaceIdIcon'

import useRedirectTo from '~/hooks/useRedirectTo'

import { Colors } from '~/utils/colors'

import { ScreenNames } from '~/types/screens'

import { useDeviceAuthState } from './module/context'

import useBiometryRegistrationLoader from './useBiometryRegistrationLoader'
import {
  getBiometryHeader,
  getBiometryActionText,
  getBiometryIsDisabledText,
  getBiometryDescription,
} from './utils/getText'
import useSuccess from '~/hooks/useSuccess'

const Biometry: React.FC = () => {
  // const handleBiometryRegistration = useBiometryRegistrationLoader()
  const biometryType = useDeviceAuthState()
  const displaySuccessLoader = useSuccess()

  const redirectToLoggedIn = useRedirectTo(ScreenNames.LoggedIn)
  const isFaceBiometry =
    biometryType === BIOMETRY_TYPE.FACE_ID || biometryType === 'FACE'

  const authenticate = async () => {
    try {
      await FingerprintScanner.authenticate({
        description: getBiometryDescription(biometryType),
        fallbackEnabled: false, // on this stage we don't want to prompr use passcode as a fallback
      })

      await AsyncStorage.setItem('biometry', biometryType || '')
      // handleBiometryRegistration();

      await displaySuccessLoader()
      redirectToLoggedIn()
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
    <ScreenContainer customStyles={{ justifyContent: 'space-between' }}>
      <View>
        <Header size={HeaderSizes.small}>
          {getBiometryHeader(biometryType)}
        </Header>
        <Paragraph color={Colors.white70}>
          {strings.SO_YOU_DONT_NEED_TO_CONFIRM}
        </Paragraph>
      </View>
      <TouchableOpacity onPress={authenticate}>
        <View style={styles.animationContainer}>
          <Ripple
            color={Colors.activity}
            initialValue1={5}
            maxValue1={15}
            maxValue2={15}
          />
        </View>
        {isFaceBiometry ? <FaceIdIcon /> : <TouchIdIcon />}
      </TouchableOpacity>
      <Paragraph color={Colors.success}>
        {getBiometryActionText(biometryType)}
      </Paragraph>
      <BtnGroup>
        <Btn type={BtnTypes.secondary} onPress={redirectToLoggedIn}>
          {strings.SKIP}
        </Btn>
      </BtnGroup>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  animationContainer: {
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
