import { useDispatch } from 'react-redux'

import { resetInteraction } from '~/modules/interaction/actions'
import { useInteraction } from '.'
import useInteractionToasts from './useInteractionToasts'

const useAuthSubmit = () => {
  const interaction = useInteraction()
  const dispatch = useDispatch()
  const {
    scheduleErrorInteraction,
    scheduleSuccessInteraction,
  } = useInteractionToasts()

  return async () => {
    try {
      const authResponse = await interaction.createAuthenticationResponse()
      await interaction.processInteractionToken(authResponse)
      await interaction.send(authResponse)

      scheduleSuccessInteraction()
      dispatch(resetInteraction())
    } catch (e) {
      scheduleErrorInteraction()
      dispatch(resetInteraction())
    }
  }
}

export default useAuthSubmit
