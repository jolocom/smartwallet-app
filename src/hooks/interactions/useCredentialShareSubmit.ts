import { useCredentialShareFlow } from './useCredentialShareFlow'
import useInteractionToasts from './useInteractionToasts'
import { useFinishInteraction } from './handlers'
import { useToasts } from '../toasts'

const useCredentialShareSubmit = () => {
  const { assembleShareResponseToken } = useCredentialShareFlow()
  const { scheduleSuccessInteraction } = useInteractionToasts()
  const { scheduleErrorWarning } = useToasts()
  const finishInteraction = useFinishInteraction()

  return async () => {
    try {
      await assembleShareResponseToken()
      scheduleSuccessInteraction()
    } catch (e) {
      scheduleErrorWarning(e)
    } finally {
      finishInteraction()
    }
  }
}

export default useCredentialShareSubmit
