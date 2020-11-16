import { useDispatch } from 'react-redux'

import { resetInteraction } from '~/modules/interaction/actions'
import { useInteraction } from '.'
import useInteractionToasts from './useInteractionToasts'

const useAuthzSubmit = () => {
  const getInteraction = useInteraction()
  const dispatch = useDispatch()
  const {
    scheduleErrorInteraction,
    scheduleSuccessInteraction,
  } = useInteractionToasts()

  return async () => {
    try {
      const interaction = await getInteraction()
      const authzResponse = await interaction.createAuthorizationResponse()
      await interaction.processInteractionToken(authzResponse)
      await interaction.send(authzResponse)

      scheduleSuccessInteraction()
      dispatch(resetInteraction())
    } catch (e) {
      scheduleErrorInteraction()
      dispatch(resetInteraction())
    }
  }
}

export default useAuthzSubmit
