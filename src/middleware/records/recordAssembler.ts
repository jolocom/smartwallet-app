import { IRecordDetails, IRecordStatus, IRecordSteps } from '~/types/records'
import { IRecordConfig } from '~/config/records'
import { Interaction, FlowType } from '@jolocom/sdk'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import truncateDid from '~/utils/truncateDid'
import {
  CredentialOfferFlowState,
  CredentialRequestFlowState,
  AuthorizationFlowState,
  AuthenticationFlowState,
} from '@jolocom/sdk/js/interactionManager/types'
import { getCredentialType } from '~/utils/dataMapping'
import { capitalizeWord } from '~/utils/stringUtils'
import { FlowState } from '@jolocom/sdk/js/interactionManager/flow'

export class RecordAssembler {
  private interaction: Interaction
  private config: IRecordConfig | undefined
  private messageTypes: string[]
  public status: IRecordStatus
  public steps: IRecordSteps[] = []

  constructor(
    interaction: Interaction,
    config: Partial<Record<FlowType, IRecordConfig>>,
  ) {
    this.interaction = interaction
    this.config = config[interaction.flow.type]
    this.messageTypes = this.getMessageTypes()
    this.status = this.processStatus()
    this.steps = this.processSteps()
  }

  public getRecordDetails(): IRecordDetails {
    return {
      title: this.getTitle(),
      status: this.status,
      steps: this.steps,
      type: this.interaction.flow.type,
      issuer: this.interaction.getSummary().initiator,
      time: new Date(this.interaction.firstMessage.issued)
        .toTimeString()
        .slice(0, 5),
    }
  }

  private getTitle(): string {
    return this.config?.title ?? 'Unknown'
  }

  private getMessageTypes(): string[] {
    return this.interaction.getMessages().map((m) => m.interactionType)
  }

  private processStatus(): IRecordStatus {
    const { expires } = this.interaction.lastMessage
    return this.isFinished()
      ? IRecordStatus.finished
      : expires < Date.now()
      ? IRecordStatus.expired
      : IRecordStatus.pending
  }

  private isFinished(): boolean {
    switch (this.interaction.flow.type) {
      case FlowType.Authorization:
      case FlowType.Authentication:
        return this.messageTypes.length === 2
      case FlowType.CredentialOffer:
        return !!this.messageTypes.find(
          (t) => t === InteractionType.CredentialsReceive,
        )
      case FlowType.CredentialShare:
        return !!this.messageTypes.find(
          (t) => t === InteractionType.CredentialResponse,
        )
      default:
        // TODO: how do we handle un-suported interactions (e.g. EstablishChannel)?
        return false
    }
  }

  private assembleAllSteps<T extends FlowState>(
    assembleFn: (messageType: string, i: number, flowState: T) => IRecordSteps,
  ) {
    const flowState = this.interaction.getSummary().state as T
    const steps = [
      ...new Set(this.messageTypes.map((t, i) => assembleFn(t, i, flowState))),
    ]

    if (this.status !== IRecordStatus.finished) {
      this.appendUnfinishedStep(steps)
    }

    return steps
  }

  private appendUnfinishedStep(steps: IRecordSteps[]) {
    steps.push({
      title: this.config?.steps.unfinished[steps.length] ?? 'Unknown',
      description:
        this.status === IRecordStatus.expired ? 'Expired' : 'Pending',
    })
  }

  private getFinishedStepTitle(index: number) {
    return this.config?.steps.finished[index] ?? 'Unknown'
  }

  private assembleCredentialOfferSteps() {
    return this.assembleAllSteps<CredentialOfferFlowState>((type, i, state) => {
      switch (type) {
        // TODO: when the Credential name is available in the @CredentialOffer,
        // should replace the type
        case InteractionType.CredentialOfferRequest:
        case InteractionType.CredentialOfferResponse:
          return {
            title: this.getFinishedStepTitle(i),
            description: state.offerSummary.map((s) => s.type).join(', '),
          }
        case InteractionType.CredentialsReceive:
          return {
            title: this.getFinishedStepTitle(i),
            description: state.issued.map((c) => c.name).join(', '),
          }
        default:
          throw new Error('Wrong interaction type for flow')
      }
    })
  }

  private assembleCredentialShareSteps() {
    return this.assembleAllSteps<CredentialRequestFlowState>(
      (type, i, state) => {
        switch (type) {
          case InteractionType.CredentialRequest:
            return {
              title: this.getFinishedStepTitle(i),
              description: state.constraints[0].requestedCredentialTypes
                .map((types) => getCredentialType(types))
                .join(',  '),
            }
          case InteractionType.CredentialOfferResponse:
            return {
              title: this.getFinishedStepTitle(i),
              description: state.providedCredentials[0].suppliedCredentials
                .map((c) => c.name)
                .join(',  '),
            }
          default:
            throw new Error('Wrong interaction type for flow')
        }
      },
    )
  }

  private assembleAuthorizationSteps() {
    return this.assembleAllSteps<AuthorizationFlowState>((type, i, state) => {
      switch (type) {
        case 'AuthorizationRequest':
        case 'AuthorizationResponse':
          return {
            title: this.getFinishedStepTitle(i),
            description: capitalizeWord(state.action ?? 'Authorize'),
          }
        default:
          throw new Error('Wrong interaction type for flow')
      }
    })
  }

  private assembleAuthenticationSteps() {
    const { initiator } = this.interaction.getSummary()
    const initiatorDid = truncateDid(initiator.did)

    return this.assembleAllSteps<AuthenticationFlowState>((_, i) => {
      switch (i) {
        case 0:
        case 1:
          return {
            title: this.getFinishedStepTitle(i),
            description: initiatorDid,
          }
        default:
          throw new Error('Wrong interaction type for flow')
      }
    })
  }

  private assembleUnknownSteps() {
    return this.assembleAllSteps((_, i) => ({
      title: this.getFinishedStepTitle(i),
      description: 'Unknown',
    }))
  }

  private processSteps() {
    switch (this.interaction.flow.type) {
      case FlowType.CredentialOffer:
        return this.assembleCredentialOfferSteps()
      case FlowType.CredentialShare:
        return this.assembleCredentialShareSteps()
      case FlowType.Authorization:
        return this.assembleAuthorizationSteps()
      case FlowType.Authentication:
        return this.assembleAuthenticationSteps()
      default:
        return this.assembleUnknownSteps()
    }
  }
}
