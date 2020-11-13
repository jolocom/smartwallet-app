import Biometry, { BiometryType } from 'react-native-biometrics'
import { useAgent } from "./sdk";

const PROP_NAME = 'biometry';

export const useBiometry = () => {
  const agent = useAgent();

  const authenticate = async () => {
    return await Biometry.simplePrompt({
      promptMessage: 'Authenticate',
    })
  }

  const getBiometry = async (): Promise<{type: BiometryType | ''} | undefined> => {
   return await agent.storage.get.setting('biometry')
  }

  // TODO: limit to biometry types only
  const setBiometry = async (value: BiometryType | '') => {
    await agent.storage.store.setting(PROP_NAME, {
      type: value
    })
  }

  const resetBiometry = () => setBiometry('');

  return {
    authenticate,
    setBiometry,
    resetBiometry,
    getBiometry
  }
}