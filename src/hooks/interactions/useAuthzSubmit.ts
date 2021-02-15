import { useFinishInteraction, useInteraction } from '.'
import useInteractionToasts from './useInteractionToasts'
import { useAgent } from '../sdk'

const useAuthzSubmit = () => {
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
      const authzResponse = await interaction.createAuthorizationResponse()
      await agent.processJWT(authzResponse)
      await interaction.send(authzResponse)

      scheduleSuccessInteraction()
    } catch (e) {
      scheduleErrorInteraction()
    } finally {
      finishInteraction()
    }
  }
}

export default useAuthzSubmit
