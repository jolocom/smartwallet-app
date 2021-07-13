import { BiometryType } from 'react-native-biometrics'

import { BiometryTypes } from '../module/deviceAuthTypes'
import useTranslation from '~/hooks/useTranslation'

export const useBiometryDescription = () => {
  const { t } = useTranslation()

  const getText = (biometryType: BiometryType | undefined) => {
    switch (biometryType) {
      case BiometryTypes.TouchID:
        return t('Biometry.promptFingerprint')
      case BiometryTypes.FaceID:
        return t('Biometry.promptFaceId')
      case 'Biometrics':
        return t('Biometry.promptBiometrics')
      default:
        throw new Error('We do not support this type of biometry')
    }
  }

  return getText
}
