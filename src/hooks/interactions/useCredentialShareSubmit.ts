import { useCredentialShareFlow } from './useCredentialShareFlow'
import { useCompleteInteraction } from './useCompleteInteraction'
import { ScreenNames } from '~/types/screens'
import { useInteraction } from './handlers'
import { useRedirect } from '../navigation'

const useCredentialShareSubmit = () => {
  const getInteraction = useInteraction()
  const { assembleShareResponseToken } = useCredentialShareFlow()
  const redirect = useRedirect()
  const { completeInteraction } = useCompleteInteraction(async () => {
    const interaction = await getInteraction()
    await assembleShareResponseToken()

    return redirect(ScreenNames.History, { id: interaction.id })
  })

  return completeInteraction
}

export default useCredentialShareSubmit
