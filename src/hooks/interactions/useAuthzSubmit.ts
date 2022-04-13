import { useInteraction } from './handlers'
import { useCompleteInteraction } from './useCompleteInteraction'
import { useAgent } from '../sdk'
import { ScreenNames } from '~/types/screens'

const useAuthzSubmit = () => {
  const getInteraction = useInteraction()
  const agent = useAgent()
  const { completeInteraction } = useCompleteInteraction(async () => {
    const interaction = await getInteraction()
    const authzResponse = await interaction.createAuthorizationResponse()
    await agent.processJWT(authzResponse)
    await interaction.send(authzResponse)

    return {
      screenToNavigate: ScreenNames.History,
    }
  })

  return completeInteraction
}

export default useAuthzSubmit
