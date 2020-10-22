import { useDispatch } from 'react-redux'

import { resetInteraction } from '~/modules/interaction/actions'
import { useInteraction } from '.'

const useAuthzSubmit = () => {
  const interaction = useInteraction()
  const dispatch = useDispatch()

  return async () => {
    const authzResponse = await interaction.createAuthorizationResponse()
    await interaction.processInteractionToken(authzResponse)
    await interaction.send(authzResponse)

    dispatch(resetInteraction())
  }
}

export default useAuthzSubmit
