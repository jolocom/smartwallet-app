import { useSelector, useDispatch } from 'react-redux'

import { getSelectedShareCredentials } from '~/modules/interaction/selectors'
import { selectShareCredential } from '~/modules/interaction/actions'
import { useInteraction } from '.'
import { useAgent } from '../sdk'

/**
 * A custom hook which exposes a collection of utils for the Credential Share interaction
 */
export const useCredentialShareFlow = () => {
  const dispatch = useDispatch()
  const getInteraction = useInteraction()
  const agent = useAgent()
  const selectedShareCredentials = useSelector(getSelectedShareCredentials)

  /**
   * Assembles a @CredentialRequestResponse token with the selected
   * credentials, processes it and sends it to the @counterparty.
   */
  const assembleShareResponseToken = async () => {
    const interaction = await getInteraction()
    if (selectedShareCredentials) {
      const mappedSelection = Object.values(selectedShareCredentials).map(
        (id) => id,
      )
      const response = await interaction.createCredentialResponse(
        mappedSelection,
      )

      await agent.processJWT(response)
      await interaction.send(response)
    }
  }

  /**
   * Selects a credential in the @interactions module
   */
  const handleSelectCredential = (credential: Record<string, string>) => {
    dispatch(selectShareCredential(credential))
  }

  return {
    assembleShareResponseToken,
    handleSelectCredential,
  }
}
