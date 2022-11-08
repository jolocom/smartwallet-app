import { useInteraction } from './handlers'
import { useCompleteInteraction } from './useCompleteInteraction'
import { useAgent } from '../sdk'
import { ScreenNames } from '~/types/screens'
import { useRedirect } from '../navigation'

const useAuthzSubmit = () => {
  const getInteraction = useInteraction()
  const agent = useAgent()
  const redirect = useRedirect()
  const { completeInteraction } = useCompleteInteraction(async () => {
    const interaction = await getInteraction()
    const authzResponse = await interaction.createAuthorizationResponse()
    await agent.processJWT(authzResponse)
    await interaction.send(authzResponse)

    return redirect(ScreenNames.History, { id: interaction.id })
  })

  return completeInteraction
}

export default useAuthzSubmit
