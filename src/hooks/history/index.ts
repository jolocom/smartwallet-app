import { FlowType, Interaction } from '@jolocom/sdk'

import { useAgent } from '~/hooks/sdk'
import { IRecordDetails, IPreLoadedInteraction } from '~/types/records'
import { getDateSection } from './utils'
import { RecordAssembler } from '~/middleware/records/recordAssembler'
import useTranslation from '../useTranslation'

export const useHistory = () => {
  const { t } = useTranslation()
  const agent = useAgent()

  const getSectionDetails = (interaction: Interaction) => {
    const { type } = interaction.flow
    const { issued } = interaction.lastMessage
    const section = getDateSection(new Date(issued))

    return { type, section, lastUpdate: issued.toString(), id: interaction.id }
  }

  const getInteractions = async (
    take: number,
    skip: number,
    flows?: FlowType[],
  ) => {
    const allInteractions = await agent.interactionManager.listInteractions({
      take,
      skip,
      flows,
      reverse: true,
    })

    const groupedInteractions = allInteractions.reduce<IPreLoadedInteraction[]>(
      (acc, intx) => {
        return [...acc, getSectionDetails(intx)]
      },
      [],
    )

    return groupedInteractions
  }

  const updateInteractionRecord = (
    interaction: Interaction,
    records: IPreLoadedInteraction[],
  ) => [
    getSectionDetails(interaction),
    ...records.filter((section) => section.id !== interaction.id),
  ]

  const createInteractionRecord = (
    interaction: Interaction,
    records: IPreLoadedInteraction[],
  ) => [getSectionDetails(interaction), ...records]

  const getConfig = () => {
    // NOTE: the first unfinished step will never be used, due to the fact
    // that there is always a request i.e. first step.
    const unfinishStep = (text: string) =>
      t('History.notFinishedStepHeader', {
        text: text.toLowerCase(),
      })

    return {
      [FlowType.Authentication]: {
        title: t('History.authenticationHeader'),
        steps: {
          finished: [
            t('History.authenticationRequestStepHeader'),
            t('History.authResponseStepHeader'),
          ],
          unfinished: [
            unfinishStep(t('History.authenticationRequestStepHeader')),
            unfinishStep(t('History.authResponseStepHeader')),
          ],
        },
      },
      [FlowType.Authorization]: {
        title: t('History.authzHeader'),
        steps: {
          finished: [
            t('History.authzRequestStepHeader'),
            t('History.authzResponseStepHeader'),
          ],
          unfinished: [
            unfinishStep(t('History.authzRequestStepHeader')),
            unfinishStep(t('History.authzResponseStepHeader')),
          ],
        },
      },
      [FlowType.CredentialOffer]: {
        title: t('History.credentialOfferHeader'),
        steps: {
          finished: [
            t('History.offerRequestStepHeader'),
            t('History.offerResponseStepHeader'),
            t('History.offerReceiveStepHeader'),
          ],
          unfinished: [
            unfinishStep(t('History.offerRequestStepHeader')),
            unfinishStep(t('History.offerResponseStepHeader')),
            unfinishStep(t('History.offerReceiveStepHeader')),
          ],
        },
      },
      [FlowType.CredentialShare]: {
        title: t('History.credShareHeader'),
        steps: {
          finished: [
            t('History.credShareRequestStepHeader'),
            t('History.credShareResponseStepHeader'),
          ],
          unfinished: [
            unfinishStep(t('History.credShareRequestStepHeader')),
            unfinishStep(t('History.credShareResponseStepHeader')),
          ],
        },
      },
    }
  }

  const assembleInteractionDetails = async (
    nonce: string,
  ): Promise<IRecordDetails> => {
    const interaction = await agent.interactionManager.getInteraction(nonce)
    const messageTypes = interaction.getMessages().map((m) => m.interactionType)
    const { expires, issued } = interaction.lastMessage
    const recordAssembler = new RecordAssembler({
      messageTypes,
      flowType: interaction.flow.type,
      summary: interaction.getSummary(),
      lastMessageDate: issued,
      expirationDate: expires,
      config: getConfig(),
    })

    return recordAssembler.getRecordDetails()
  }

  return {
    getInteractions,
    assembleInteractionDetails,
    updateInteractionRecord,
    createInteractionRecord,
  }
}
