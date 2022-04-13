import { useInteraction } from './handlers'
import { useCompleteInteraction } from './useCompleteInteraction'
import { useAgent } from '../sdk'
import { ScreenNames } from '~/types/screens'

const useAuthSubmit = () => {
  const getInteraction = useInteraction()
  const agent = useAgent()
  const { completeInteraction } = useCompleteInteraction(async () => {
    const interaction = await getInteraction()
    const authResponse = await interaction.createAuthenticationResponse()
    await agent.processJWT(authResponse)
    await interaction.send(authResponse)

    return {
      screenToNavigate: ScreenNames.History,
    }
  })

  return completeInteraction
}

export default useAuthSubmit
