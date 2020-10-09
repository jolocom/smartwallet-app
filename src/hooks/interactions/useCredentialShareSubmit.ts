import { useDispatch } from 'react-redux'

import { useCredentialShareFlow } from './useCredentialShareFlow'
import { showNotification } from './utils'
import { resetInteraction } from '~/modules/interaction/actions'

const useCredentialShareSubmit = () => {
  const { assembleShareResponseToken } = useCredentialShareFlow()
  const dispatch = useDispatch()

  return async () => {
    try {
      await assembleShareResponseToken()
      showNotification('Credentials shared successfully')
    } catch (e) {
      showNotification('Failed to share credentials', e.message)
    } finally {
      dispatch(resetInteraction())
    }
  }
}

export default useCredentialShareSubmit
