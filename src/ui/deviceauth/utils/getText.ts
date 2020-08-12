import { BIOMETRY_TYPE } from 'react-native-keychain'

import strings from '../../../locales/strings'
import { BiometryTypes } from '../types'

export const getBiometryHeader = (biometryType: BiometryTypes) => {
  switch (biometryType) {
    case BIOMETRY_TYPE.TOUCH_ID:
      return strings.USE_TOUCH_ID_TO_AUTHORIZE
    case BIOMETRY_TYPE.FACE_ID:
      return strings.USE_FACE_ID_TO_AUTHORIZE
    case BIOMETRY_TYPE.FINGERPRINT:
      return strings.USE_FINGERPRINT_TO_AUTHORIZE
    case 'FACE':
      return strings.USE_FACE_TO_AUTHORIZE
    default:
      return ''
  }
}

export const getBiometryActionText = (biometryType: BiometryTypes) => {
  switch (biometryType) {
    case BIOMETRY_TYPE.TOUCH_ID:
      return strings.TAP_TO_ACTIVATE_TOUCH_ID
    case BIOMETRY_TYPE.FACE_ID:
      return strings.TAP_TO_ACTIVATE_FACE_ID
    case BIOMETRY_TYPE.FINGERPRINT:
      return strings.TAP_TO_ACTIVATE_FINGERPRINT
    case 'FACE':
      return strings.TAP_TO_ACTIVATE_FACE
    default:
      return ''
  }
}

export const getBiometryIsDisabledText = (biometryType: BiometryTypes) => {
  switch (biometryType) {
    case BIOMETRY_TYPE.TOUCH_ID:
      return strings.TOUCH_ID_IS_DISABLED
    case BIOMETRY_TYPE.FACE_ID:
      return strings.FACE_ID_IS_DISABLED
    case BIOMETRY_TYPE.FINGERPRINT:
      return strings.FINGERPRINT_IS_DISABLED
    case 'FACE':
      return strings.FACE_IS_DISABLED
    default:
      return ''
  }
}

export const getBiometryDescription = (biometryType: BiometryTypes) => {
  switch (biometryType) {
    case BIOMETRY_TYPE.TOUCH_ID || BIOMETRY_TYPE.FINGERPRINT:
      return strings.SCAN_YOUR_FINGERPRINT_ON_THE_DEVICE_SCANNER
    case BIOMETRY_TYPE.FACE_ID || 'FACE':
      return strings.SCAN_YOUR_FACE
    default:
      return ''
  }
}
