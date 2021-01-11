import { useAgent } from '~/hooks/sdk'
import { IRecordDetails } from './types'
import {
  getDateSection,
  filterUniqueById,
  interactionTypeToFlowType,
} from './utils'
import {
  CredentialOfferFlowState,
  CredentialRequestFlowState,
  AuthorizationFlowState,
} from '@jolocom/sdk/js/interactionManager/types'
import { RecordManager } from './recordManager'
import { recordConfig } from './config'

export const useHistory = () => {
  const agent = useAgent()

  const getInteractions = () => {
    return agent.storage.get
      .interactionTokens({})
      .then((tokens) =>
        tokens
          .map(({ nonce, issued, interactionType }) => ({
            id: nonce,
            section: getDateSection(new Date(issued)),
            type: interactionTypeToFlowType[interactionType],
          }))
          .reverse(),
      )
      .then(filterUniqueById)
  }

  const getInteractionDetails = async (
    nonce: string,
  ): Promise<IRecordDetails> => {
    const interaction = await agent.interactionManager.getInteraction(nonce)
    const recordManager = new RecordManager(interaction, recordConfig)

    return recordManager.getRecordDetails()
  }

  return {
    getInteractions,
    getInteractionDetails,
  }
}
