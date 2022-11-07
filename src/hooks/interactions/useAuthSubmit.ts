import { useInteraction } from './handlers'
import { useCompleteInteraction } from './useCompleteInteraction'
import { useAgent } from '../sdk'
import { ScreenNames } from '~/types/screens'
import { useRedirect } from '../navigation'

const useAuthSubmit = () => {
  const getInteraction = useInteraction()
  const agent = useAgent()
  const redirect = useRedirect()
  const { completeInteraction } = useCompleteInteraction(async () => {
    const interaction = await getInteraction()
    const authResponse = await interaction.createAuthenticationResponse()
    await agent.processJWT(authResponse)
    await interaction.send(authResponse)

    return redirect(ScreenNames.History, { id: interaction.id })
  })

  return completeInteraction
}

export default useAuthSubmit
