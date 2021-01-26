import { useDispatch } from 'react-redux'

import { resetInteraction } from '~/modules/interaction/actions'
import { useInteraction } from '.'
import useInteractionToasts from './useInteractionToasts'
import { useAgent } from '../sdk'

const useAuthSubmit = () => {
  const getInteraction = useInteraction()
  const agent = useAgent()
  const dispatch = useDispatch()
  const {
    scheduleErrorInteraction,
    scheduleSuccessInteraction,
  } = useInteractionToasts()

  return async () => {
    try {
      const interaction = await getInteraction()
      const authResponse = await interaction.createAuthenticationResponse()
      await agent.processJWT(authResponse)
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
