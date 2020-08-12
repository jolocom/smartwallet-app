import { Alert, Linking } from 'react-native'

import strings from '../../../locales/strings'
import { BiometryTypes } from '../types'
import { getBiometryIsDisabledText } from '../utils/getText'

export const handleNotEnrolled = (biometryType: BiometryTypes) => {
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
        // onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ],
    { cancelable: false },
  )
}
