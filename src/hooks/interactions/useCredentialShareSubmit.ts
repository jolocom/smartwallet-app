import { useCredentialShareFlow } from './useCredentialShareFlow'
import { useCompleteInteraction } from './useCompleteInteraction'
import { ScreenNames } from '~/types/screens'

const useCredentialShareSubmit = () => {
  const { assembleShareResponseToken } = useCredentialShareFlow()
  const { completeInteraction } = useCompleteInteraction(async () => {
    await assembleShareResponseToken()

    return {
      screenToNavigate: ScreenNames.History,
    }
  })

  return completeInteraction
}

export default useCredentialShareSubmit
