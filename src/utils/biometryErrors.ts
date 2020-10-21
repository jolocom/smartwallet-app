import { Alert, Linking } from 'react-native'
import { BiometryTypes } from '~/screens/Modals/DeviceAuthentication/module/deviceAuthTypes'
import { getBiometryIsDisabledText } from '~/screens/Modals/DeviceAuthentication/utils/getText'

import { strings } from '~/translations/strings'

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
