import { useDispatch } from 'react-redux'

import { resetInteraction } from '~/modules/interaction/actions'
import { useInteraction } from '../sdk'

const useAuthSubmit = () => {
  const interaction = useInteraction()
  const dispatch = useDispatch()

  return async () => {
    const authResponse = await interaction.createAuthenticationResponse()
    await interaction.processInteractionToken(authResponse)
    await interaction.send(authResponse)

    dispatch(resetInteraction())
  }
}

export default useAuthSubmit
