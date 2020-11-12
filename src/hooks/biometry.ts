import { useAgent } from "./sdk";

const PROP_NAME = 'biometry';

export const useBiometry = () => {
  const agent = useAgent();


  const getBiometry = async (): Promise<{type: string} | undefined> => {
   return await agent.storage.get.setting('biometry')
  }

  // TODO: limit to biometry types only
  const setBiometry = async (value: string) => {
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