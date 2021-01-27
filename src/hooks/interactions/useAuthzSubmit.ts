import { useDispatch } from 'react-redux'

import { resetInteraction } from '~/modules/interaction/actions'
import { useInteraction } from '.'
import useInteractionToasts from './useInteractionToasts'
import { useAgent } from '../sdk'

const useAuthzSubmit = () => {
  const getInteraction = useInteraction()
  const dispatch = useDispatch()
  const agent = useAgent()
  const {
    scheduleErrorInteraction,
    scheduleSuccessInteraction,
  } = useInteractionToasts()

  return async () => {
    try {
      const interaction = await getInteraction()
      const authzResponse = await interaction.createAuthorizationResponse()
      await agent.processJWT(authzResponse)
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
