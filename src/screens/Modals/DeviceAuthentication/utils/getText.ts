import { strings } from '~/translations/strings'
import { BiometryTypes } from '../module/deviceAuthTypes'

export const getBiometryHeader = (biometryType: BiometryTypes) => {
  switch (biometryType) {
    case BiometryTypes.TouchID:
      return strings.USE_TOUCH_ID_TO_AUTHORIZE
    case BiometryTypes.FaceID:
      return strings.USE_FACE_ID_TO_AUTHORIZE
    case BiometryTypes.Biometrics:
      return strings.USE_BIOMETRICS
    case BiometryTypes.Fingerprint:
      return strings.USE_FINGERPRINT_TO_AUTHORIZE
    case BiometryTypes.FACE:
      return strings.USE_FACE_TO_AUTHORIZE
    default:
      return ''
  }
}

export const getBiometryIsDisabledText = (biometryType: BiometryTypes) => {
  switch (biometryType) {
    case BiometryTypes.TouchID:
      return strings.TOUCH_ID_IS_DISABLED
    case BiometryTypes.FaceID:
      return strings.FACE_ID_IS_DISABLED
    case BiometryTypes.Biometrics:
      return strings.USE_BIOMETRICS
    case BiometryTypes.Fingerprint:
      return strings.FINGERPRINT_IS_DISABLED
    case BiometryTypes.FACE:
      return strings.FACE_IS_DISABLED
    default:
      return ''
  }
}

export const getBiometryDescription = (biometryType: BiometryTypes) => {
  switch (biometryType) {
    case BiometryTypes.TouchID || BiometryTypes.Fingerprint:
      return strings.SCAN_YOUR_FINGERPRINT_ON_THE_DEVICE_SCANNER
    case BiometryTypes.FaceID || BiometryTypes.FACE:
      return strings.SCAN_YOUR_FACE
    default:
      return ''
  }
}
