import { BIOMETRY_TYPE } from 'react-native-keychain'
import { BiometryType } from 'react-native-biometrics'

import { strings } from '~/translations/strings'

export const getBiometryHeader = (biometryType: BiometryType) => {
  switch (biometryType) {
    case BIOMETRY_TYPE.TOUCH_ID:
      return strings.USE_TOUCH_ID_TO_AUTHORIZE
    case BIOMETRY_TYPE.FACE_ID:
      return strings.USE_FACE_ID_TO_AUTHORIZE
    case 'Biometrics':
      return strings.USE_BIOMETRICS_TO_AUTHORIZE
    default:
      return ''
  }
}

export const getBiometryDescription = (biometryType: BiometryType) => {
  switch (biometryType) {
    case BIOMETRY_TYPE.TOUCH_ID:
      return strings.SCAN_YOUR_FINGERPRINT_ON_THE_DEVICE_SCANNER
    case BIOMETRY_TYPE.FACE_ID:
      return strings.SCAN_YOUR_FACE
    case 'Biometrics':
      return strings.PROVIDE_BIOMETRICS
    default:
      return ''
  }
}
