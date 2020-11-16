import { useDispatch } from 'react-redux'

import { resetInteraction } from '~/modules/interaction/actions'
import { useInteraction } from '.'

const useAuthSubmit = () => {
  const getInteraction = useInteraction()
  const dispatch = useDispatch()

  return async () => {
    const interaction = await getInteraction()
    const authResponse = await interaction.createAuthenticationResponse()
    await interaction.processInteractionToken(authResponse)
    await interaction.send(authResponse)

    dispatch(resetInteraction())
  }
}

export default useAuthSubmit
