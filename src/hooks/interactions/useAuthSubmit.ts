import { useFinishInteraction, useInteraction } from './handlers'
import useInteractionToasts from './useInteractionToasts'
import { useAgent } from '../sdk'

const useAuthSubmit = () => {
  const getInteraction = useInteraction()
  const agent = useAgent()
  const {
    scheduleErrorInteraction,
    scheduleSuccessInteraction,
  } = useInteractionToasts()
  const finishInteraction = useFinishInteraction()

  return async () => {
    try {
      const interaction = await getInteraction()
      const authResponse = await interaction.createAuthenticationResponse()
      await agent.processJWT(authResponse)
      await interaction.send(authResponse)

      scheduleSuccessInteraction()
    } catch (e) {
      scheduleErrorInteraction(e)
    } finally {
      finishInteraction()
    }
  }
}

export default useAuthSubmit
