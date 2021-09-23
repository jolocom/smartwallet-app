import { Agent } from 'react-native-jolocom'
import { useAgent } from './sdk'

export enum SettingKeys {
  pinNrAttemptCyclesLeft = 'pinNrAttemptCyclesLeft',
  pinNrAttemptsLeft = 'pinNrAttemptsLeft',
  countdown = 'countdown',
}

const handleRetrieveSettingValue = (agent: Agent) => {
  return agent.storage.get.setting
}

const handleSetSettingValue = (agent: Agent) => {
  return async (key: SettingKeys, value: object) =>
    await agent.storage.store.setting(key, value)
}

// TODO: use this hook in all places we set/get setting values
const useSettings = () => {
  const agent = useAgent()
  return {
    get: handleRetrieveSettingValue(agent),
    set: handleSetSettingValue(agent),
  }
}

export default useSettings
