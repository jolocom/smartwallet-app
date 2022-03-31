import { useInteraction } from './handlers'
import { useCompleteInteraction } from './useCompleteInteraction'
import { useAgent } from '../sdk'

const useAuthzSubmit = () => {
  const getInteraction = useInteraction()
  const agent = useAgent()
  const { completeInteraction } = useCompleteInteraction(async () => {
    const interaction = await getInteraction()
    const authzResponse = await interaction.createAuthorizationResponse()
    await agent.processJWT(authzResponse)
    await interaction.send(authzResponse)

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

export default useAuthzSubmit
