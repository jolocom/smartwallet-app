import { useCredentialShareFlow } from './useCredentialShareFlow'
import useInteractionToasts from './useInteractionToasts'
import { useFinishInteraction } from './handlers'

const useCredentialShareSubmit = () => {
  const { assembleShareResponseToken } = useCredentialShareFlow()
  const {
    scheduleSuccessInteraction,
    scheduleErrorInteraction,
  } = useInteractionToasts()
  const finishInteraction = useFinishInteraction()

  return async () => {
    try {
      await assembleShareResponseToken()
      scheduleSuccessInteraction()
    } catch (e) {
      scheduleErrorInteraction()
    } finally {
      finishInteraction()
    }
  }
}

export default useCredentialShareSubmit
