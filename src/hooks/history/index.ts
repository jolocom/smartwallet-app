import { useAgent } from '~/hooks/sdk'
import { IRecordDetails } from '~/types/records'
import {
  getDateSection,
  filterUniqueById,
  interactionTypeToFlowType,
} from './utils'
import { RecordManager } from '~/middleware/records/recordManager'
import { recordConfig } from '~/config/records'

export const useHistory = () => {
  const agent = useAgent()

  const getInteractions = async () => {
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
