import { Alert, Linking } from 'react-native'

import { strings } from '~/translations/strings'
import { BiometryTypes } from '~/screens/DeviceAuthentication/module/deviceAuthTypes'
import { getBiometryIsDisabledText } from '~/screens/DeviceAuthentication/utils/getText'

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
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ],
    { cancelable: false },
  )
}
