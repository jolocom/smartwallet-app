import { useDispatch } from 'react-redux'

import { resetInteraction } from '~/modules/interaction/actions'
import { useInteraction } from '.'

const useResolutionSubmit = () => {
  const getInteraction = useInteraction()
  const dispatch = useDispatch()

  return async () => {
    const interaction = await getInteraction()
    const resolutionResponse = await interaction.createResolutionResponse()
    await interaction.processInteractionToken(resolutionResponse)
    await interaction.send(resolutionResponse)

    dispatch(resetInteraction())
  }
}

export default useResolutionSubmit
