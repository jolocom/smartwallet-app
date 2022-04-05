import { useFinishInteraction, useInteraction } from './handlers'
import useInteractionToasts from './useInteractionToasts'
import { useAgent } from '../sdk'
import { useToasts } from '../toasts'

const useAuthzSubmit = () => {
  const getInteraction = useInteraction()
  const agent = useAgent()
  const { scheduleSuccessInteraction } = useInteractionToasts()
  const { scheduleErrorWarning } = useToasts()
  const finishInteraction = useFinishInteraction()

  return async () => {
    try {
      const interaction = await getInteraction()
      const authzResponse = await interaction.createAuthorizationResponse()
      await agent.processJWT(authzResponse)
      await interaction.send(authzResponse)

      scheduleSuccessInteraction().catch(scheduleErrorWarning)
    } catch (e) {
      scheduleErrorWarning(e)
    } finally {
      finishInteraction()
    }
  }
}

export default useAuthzSubmit
