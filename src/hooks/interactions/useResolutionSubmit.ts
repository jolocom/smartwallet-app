import { useDispatch } from 'react-redux'

import { resetInteraction } from '~/modules/interaction/actions'
import { useInteraction } from './handlers'
import { useAgent } from '../sdk'

const useResolutionSubmit = () => {
  const getInteraction = useInteraction()
  const agent = useAgent()
  const dispatch = useDispatch()

  return async () => {
    const interaction = await getInteraction()
    const resolutionResponse = await interaction.createResolutionResponse()
    await agent.processJWT(resolutionResponse)
    await interaction.send(resolutionResponse)

    dispatch(resetInteraction())
  }
}

export default useResolutionSubmit
