import { useDispatch } from 'react-redux'

import { useCredentialShareFlow } from './useCredentialShareFlow'
import { resetInteraction } from '~/modules/interaction/actions'
import useInteractionToasts from './useInteractionToasts'

const useCredentialShareSubmit = () => {
  const { assembleShareResponseToken } = useCredentialShareFlow()
  const {
    scheduleSuccessInteraction,
    scheduleErrorInteraction,
  } = useInteractionToasts()
  const dispatch = useDispatch()

  return async () => {
    try {
      await assembleShareResponseToken()
      scheduleSuccessInteraction()
    } catch (e) {
      scheduleErrorInteraction()
    } finally {
      dispatch(resetInteraction())
    }
  }
}

export default useCredentialShareSubmit
