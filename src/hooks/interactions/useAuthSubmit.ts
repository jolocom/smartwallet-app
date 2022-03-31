import { useInteraction } from './handlers'
import { useCompleteInteraction } from './useCompleteInteraction'
import { useAgent } from '../sdk'

const useAuthSubmit = () => {
  const getInteraction = useInteraction()
  const agent = useAgent()
  const { completeInteraction } = useCompleteInteraction(async () => {
    const interaction = await getInteraction()
    const authResponse = await interaction.createAuthenticationResponse()
    await agent.processJWT(authResponse)
    await interaction.send(authResponse)

    /*
     * NOTE:
     * 1. in case you want to override a general
     * interaction success toast, return an object
     * with `successToast` property.
     * 2. in case you choose to pause an execution of
     * the interaction flow and inject custom logic
     * to be run meanwhile return an object
     * `{pause: true, pauseFn: () => void}`
     */
    return undefined
  })

  return completeInteraction
}

export default useAuthSubmit
