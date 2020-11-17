import { BiometryTypes } from '../module/deviceAuthTypes'

import { strings } from '~/translations/strings'
import { BiometryType } from 'react-native-biometrics'

export const getBiometryHeader = (biometryType: BiometryType | undefined) => {
  switch (biometryType) {
    case BiometryTypes.TouchID:
      return strings.USE_TOUCH_ID_TO_AUTHORIZE
    case BiometryTypes.FaceID:
      return strings.USE_FACE_ID_TO_AUTHORIZE
    case 'Biometrics':
      return strings.USE_BIOMETRICS_TO_AUTHORIZE
    default:
      throw new Error('We do not support this type of biometry')
  }
}

export const getBiometryDescription = (biometryType: BiometryType | undefined) => {
  switch (biometryType) {
    case BiometryTypes.TouchID:
      return strings.SCAN_YOUR_FINGERPRINT_ON_THE_DEVICE_SCANNER
    case BiometryTypes.FaceID:
      return strings.SCAN_YOUR_FACE
    case 'Biometrics':
      return strings.PROVIDE_BIOMETRICS
    default:
      throw new Error('We do not support this type of biometry')
  }
}
