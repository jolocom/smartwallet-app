import { useAgent } from '~/hooks/sdk'
import { IRecordDetails, IRecordStatus, IRecordSteps } from './types'
import {
  getDateSection,
  filterUniqueById,
  interactionTypeToFlowType,
} from './utils'
import { Interaction, FlowType, JSONWebToken } from '@jolocom/sdk'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import truncateDid from '~/utils/truncateDid'
import {
  CredentialOfferFlowState,
  CredentialRequestFlowState,
  AuthorizationFlowState,
} from '@jolocom/sdk/js/interactionManager/types'
import { getCredentialType } from '~/utils/dataMapping'
import { capitalizeWord } from '~/utils/stringUtils'

interface IRecordConfig {
  title: string
  steps: {
    finished: string[]
    unfinished: string[]
  }
}

// NOTE: the first unfinished step will never be used, due to the fact
// that there is always a request i.e. first step.
const recordConfig: Partial<Record<FlowType, IRecordConfig>> = {
  [FlowType.Authentication]: {
    title: 'Authentication',
    steps: {
      finished: ['Requested', 'Confirmed'],
      unfinished: ['Not requested', 'Not confirmed'],
    },
  },
  [FlowType.Authorization]: {
    title: 'Authentication',
    steps: {
      finished: ['Authorized', 'Confirmed'],
      unfinished: ['Not authorized', 'Not confirmed'],
    },
  },
  [FlowType.CredentialOffer]: {
    title: 'Incoming offer',
    steps: {
      finished: ['Offered', 'Selected', 'Issued'],
      unfinished: ['Not offered', 'Not selected', 'Not issued'],
    },
  },
  [FlowType.CredentialShare]: {
    title: 'Incoming request',
    steps: {
      finished: ['Requested', 'Shared'],
      unfinished: ['Not requested', 'Not shared'],
    },
  },
}

class RecordManager {
  private interaction: Interaction
  private config: IRecordConfig | undefined
  public status: IRecordStatus
  public steps: IRecordSteps[] = []

  constructor(
    interaction: Interaction,
    config: Partial<Record<FlowType, IRecordConfig>>,
  ) {
    this.interaction = interaction
    this.config = config[interaction.flow.type]
    this.status = this.processStatus()
    // NOTE: it's a bit weird that it is different from how this.status is initialized
    this.processSteps()
    return this
  }

  private processStatus(): IRecordStatus {
    const { expires } = this.interaction.lastMessage
    return this.isFinished()
      ? IRecordStatus.finished
      : new Date(expires) < new Date()
      ? IRecordStatus.expired
      : IRecordStatus.pending
  }

  private isFinished(): boolean {
    switch (this.interaction.flow.type) {
      case FlowType.Authorization:
      case FlowType.Authentication:
        return this.interaction.getMessages().length === 2
      case FlowType.CredentialOffer:
        return !!this.interaction
          .getMessages()
          .find((t) => t.interactionType === InteractionType.CredentialsReceive)
      case FlowType.CredentialOffer:
        return !!this.interaction
          .getMessages()
          .find((t) => t.interactionType === InteractionType.CredentialResponse)
      default:
        // TODO: how do we handle un-suported interactions (e.g. EstablishChannel)?
        return false
    }
  }

  private assembleSteps(
    assembleFn: (message: JSONWebToken<any>, i: number) => IRecordSteps | null,
  ) {
    // NOTE: adding the Set to assure the same token wasn't assembled twice
    return [
      ...new Set(
        this.interaction.getMessages().reduce<IRecordSteps[]>((acc, m, i) => {
          const step = assembleFn(m, i)
          if (step) acc.push(step)
          return acc
        }, []),
      ),
    ]
  }

  private appendUnfinishedStep() {
    if (this.status !== IRecordStatus.finished) {
      this.steps.push({
        title: this.config?.steps.unfinished[this.steps.length] ?? 'Unknown',
        description:
          this.status === IRecordStatus.expired ? 'Expired' : 'Pending',
      })
    }
  }

  private getFinishedStepTitle(index: number) {
    return this.config?.steps.finished[index] ?? 'Unknown'
  }

  private assembleCredentialOfferSteps() {
    this.steps = this.assembleSteps((m, i) => {
      const offerState = this.interaction.getSummary()
        .state as CredentialOfferFlowState

      switch (m.interactionType) {
        case InteractionType.CredentialOfferRequest:
          // TODO: when the Credential name is available in the @CredentialOffer,
          // should replace the type
          return {
            title: this.getFinishedStepTitle(i),
            description: offerState.offerSummary.map((s) => s.type).join(', '),
          }
        case InteractionType.CredentialOfferResponse:
          return {
            title: this.getFinishedStepTitle(i),
            description: offerState.issued.map((c) => c.name).join(', '),
          }
        case InteractionType.CredentialsReceive:
          return {
            title: this.getFinishedStepTitle(i),
            description: offerState.issued.map((c) => c.name).join(', '),
          }
        default:
          return null
      }
    })
  }

  private assembleCredentialShareSteps() {
    this.steps = this.assembleSteps((m, i) => {
      const shareState = this.interaction.getSummary()
        .state as CredentialRequestFlowState
      switch (m.interactionType) {
        case InteractionType.CredentialRequest:
          return {
            title: this.getFinishedStepTitle(i),
            description: shareState.constraints[0].requestedCredentialTypes
              .map((types) => getCredentialType(types))
              .join(',  '),
          }
        case InteractionType.CredentialOfferResponse:
          return {
            title: this.getFinishedStepTitle(i),
            description: shareState.providedCredentials[0].suppliedCredentials
              .map((c) => c.name)
              .join(',  '),
          }
        default:
          return null
      }
    })
  }

  private assembleAuthorizationSteps() {
    const { action = 'Authorize' } = this.interaction.getSummary()
      .state as AuthorizationFlowState

    this.steps = this.assembleSteps((m, i) => {
      switch (m.interactionType) {
        case 'AuthorizationRequest':
          return {
            title: this.getFinishedStepTitle(i),
            description: capitalizeWord(action),
          }
        case 'AuthorizationResponse':
          return {
            title: this.getFinishedStepTitle(i),
            description: capitalizeWord(action),
          }
        default:
          return null
      }
    })
  }

  private assembleAuthenticationSteps() {
    const { initiator } = this.interaction.getSummary()
    const initiatorDid = truncateDid(initiator.did)

    this.steps = this.assembleSteps((m, i) => {
      switch (i) {
        case 0:
          return {
            title: this.getFinishedStepTitle(i),
            description: initiatorDid,
          }
        case 1:
          return {
            title: this.getFinishedStepTitle(i),
            description: initiatorDid,
          }
        default:
          return null
      }
    })
  }

  private assembleUnknownSteps() {
    this.steps = this.assembleSteps((m, i) => ({
      title: this.getFinishedStepTitle(i),
      description: 'Unknown',
    }))
  }

  private processSteps() {
    switch (this.interaction.flow.type) {
      case FlowType.CredentialOffer:
        this.assembleCredentialOfferSteps()
        this.appendUnfinishedStep()
        break
      case FlowType.CredentialShare:
        this.assembleCredentialShareSteps()
        this.appendUnfinishedStep()
        break
      case FlowType.Authorization:
        this.assembleAuthorizationSteps()
        this.appendUnfinishedStep()
        break
      case FlowType.Authentication:
        this.assembleAuthenticationSteps()
        this.appendUnfinishedStep()
        break
      default:
        this.assembleUnknownSteps()
        this.appendUnfinishedStep()
        break
    }
  }
}

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
    const { status, steps } = recordManager

    return {
      status,
      steps,
      type: interaction.flow.type,
      issuer: interaction.getSummary().initiator,
      time: new Date(interaction.firstMessage.issued)
        .toTimeString()
        .slice(0, 5),
    }
  }

  return {
    getInteractions,
    getInteractionDetails,
  }
}
