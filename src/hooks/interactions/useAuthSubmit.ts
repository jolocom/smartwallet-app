import { useFinishInteraction, useInteraction } from './handlers'
import useInteractionToasts from './useInteractionToasts'
import { useAgent } from '../sdk'
import { useToasts } from '../toasts'

const useAuthSubmit = () => {
  const getInteraction = useInteraction()
  const agent = useAgent()
  const { scheduleSuccessInteraction } = useInteractionToasts()
  const { scheduleErrorWarning } = useToasts()
  const finishInteraction = useFinishInteraction()

  return async () => {
    try {
      const interaction = await getInteraction()
      const authResponse = await interaction.createAuthenticationResponse()
      await agent.processJWT(authResponse)
      await interaction.send(authResponse)

      scheduleSuccessInteraction().catch(scheduleErrorWarning)
    } catch (e) {
      scheduleErrorWarning(e)
    } finally {
      finishInteraction()
    }
  }
}

export default useAuthSubmit
