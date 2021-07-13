import Biometry, { BiometryType } from 'react-native-biometrics'
import { useBiometryDescription } from '~/screens/Modals/DeviceAuthentication/utils/getText'
import { StorageKeys, useAgent } from './sdk'

export const useBiometry = () => {
  const agent = useAgent()
  const getBiometryDescription = useBiometryDescription()

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
