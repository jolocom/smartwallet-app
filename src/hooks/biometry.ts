import { Biometrics } from "react-native-fingerprint-scanner";
import { useAgent } from "./sdk";

const PROP_NAME = 'biometry';

export const useBiometry = () => {
  const agent = useAgent();


  const getBiometry = async (): Promise<{type: Biometrics | ''} | undefined> => {
   return await agent.storage.get.setting('biometry')
  }

  // TODO: limit to biometry types only
  const setBiometry = async (value: Biometrics | '') => {
    await agent.storage.store.setting(PROP_NAME, {
      type: value
    })
  }

  const updateBiometry = setBiometry;

  const resetBiometry = () => setBiometry('');

  return {
    updateBiometry,
    resetBiometry,
    getBiometry
  }
}