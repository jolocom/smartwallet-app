import Biometry, { BiometryType } from 'react-native-biometrics'
import { BiometryTypes } from '~/screens/Modals/WalletAuthentication/module/deviceAuthTypes'
import { StorageKeys, useAgent } from './sdk'
import useTranslation from './useTranslation'

export const useBiometry = () => {
  const { t } = useTranslation()
  const agent = useAgent()

  const getBiometryDescription = (biometryType: BiometryType | undefined) => {
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

  const authenticate = async (biometryType: BiometryType | undefined) => {
    return await Biometry.simplePrompt({
      promptMessage: getBiometryDescription(biometryType),
    })
  }

  const getEnrolledBiometry = async () => {
    return await Biometry.isSensorAvailable()
  }

  const getBiometry = async (): Promise<
    { type: BiometryType | undefined } | undefined
  > => {
    return await agent.storage.get.setting(StorageKeys.biometry)
  }

  const setBiometry = async (value: BiometryType | undefined) => {
    await agent.storage.store.setting(StorageKeys.biometry, {
      type: value,
    })
  }

  const resetBiometry = () => setBiometry(undefined)

  return {
    authenticate,
    getEnrolledBiometry,
    setBiometry,
    resetBiometry,
    getBiometry,
  }
}
