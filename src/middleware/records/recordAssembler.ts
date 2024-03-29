import {
  IRecordDetails,
  IRecordStatus,
  IRecordSteps,
  IRecordConfig,
  IFlowRecordConfig,
  IStatusRecordConfig,
} from '~/types/records'
import { FlowType } from '@jolocom/sdk'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import truncateDid from '~/utils/truncateDid'
import {
  CredentialOfferFlowState,
  CredentialRequestFlowState,
  AuthorizationFlowState,
  AuthenticationFlowState,
  InteractionSummary,
} from '@jolocom/sdk/js/interactionManager/types'
import { getCredentialType } from '~/utils/dataMapping'
import { capitalizeWord } from '~/utils/stringUtils'
import { FlowState } from '@jolocom/sdk/js/interactionManager/flow'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'

interface IRecordAssembler {
  messageTypes: string[]
  flowType: FlowType
  summary: InteractionSummary
  lastMessageDate: number
  expirationDate: number
  config: IRecordConfig
}

export class RecordAssembler {
  private config: IFlowRecordConfig | undefined
  private statusConfig: IStatusRecordConfig
  private messageTypes: string[]
  private flowType: FlowType
  private summary: InteractionSummary
  private expirationDate: number
  private lastMessageDate: number

  private status: IRecordStatus
  private steps: IRecordSteps[] = []

  constructor({
    messageTypes,
    flowType,
    summary,
    expirationDate,
    lastMessageDate,
    config,
  }: IRecordAssembler) {
    this.messageTypes = messageTypes
    this.flowType = flowType
    this.summary = summary
    this.expirationDate = expirationDate
    this.lastMessageDate = lastMessageDate
    this.config = config.flows[flowType]
    this.statusConfig = config.status
    this.status = this.processStatus()
    this.steps = this.processSteps()
  }

  public getRecordDetails(): IRecordDetails {
    return {
      title: this.getTitle(),
      status: this.status,
      steps: this.steps,
      issuer: this.summary.initiator,
      time: new Date(this.lastMessageDate).toTimeString().slice(0, 5),
    }
  }

  private getTitle(): string {
    return this.config?.title ?? this.statusConfig.unknown
  }

  private processStatus(): IRecordStatus {
    return this.isFinished()
      ? IRecordStatus.finished
      : this.expirationDate < Date.now()
      ? IRecordStatus.expired
      : IRecordStatus.pending
  }

  private isFinished(): boolean {
    switch (this.flowType) {
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
    const flowState = this.summary.state as T
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
      title:
        this.config?.steps.unfinished[steps.length] ??
        this.statusConfig.unknown,
      description:
        this.status === IRecordStatus.expired
          ? this.statusConfig.expired
          : this.statusConfig.pending,
    })
  }

  private getFinishedStepTitle(index: number) {
    return this.config?.steps.finished[index] ?? this.statusConfig.unknown
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
            description: state.offerSummary
              /**
               * A fallback to 'Unknown' as a credential name is
               * happening in RecordStep || RecordFinalStep
               * components to enable translations
               */
              .map((s) =>
                s.credential?.name?.length
                  ? s.credential?.name
                  : this.statusConfig.unknown,
              )
              .join(', '),
          }
        case InteractionType.CredentialsReceive:
          return {
            title: this.getFinishedStepTitle(i),
            description: state.issued
              .reduce<SignedCredential[]>((validCreds, c, idx) => {
                const cred = c as SignedCredential
                if (state.credentialsValidity[idx] === true) {
                  validCreds.push(cred)
                }
                return validCreds
              }, [])
              .map((c) => (c.name.length ? c.name : this.statusConfig.unknown))
              .join(', '),
          }
        default:
          throw new Error('Wrong interaction type for flow')
      }
    })
  }

  private assembleCredentialShareSteps() {
    return this.assembleAllSteps<CredentialRequestFlowState>(
      (type, i, state) => {
        const areCredsSupplied = !!state.providedCredentials.length

        const requestedCreds = state.constraints[0].requestedCredentialTypes
          .map((types) => getCredentialType(types))
          .join(',  ')

        const displayCreds = areCredsSupplied
          ? state.providedCredentials[0].suppliedCredentials
              .map((c) =>
                c.name.length ? c.name : this.statusConfig.unknown,
              )
              .join(', ')
          : requestedCreds

        switch (type) {
          case InteractionType.CredentialRequest:
            return {
              title: this.getFinishedStepTitle(i),
              description: displayCreds,
            }
          case InteractionType.CredentialResponse:
            return {
              title: this.getFinishedStepTitle(i),
              description: displayCreds,
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
            description: capitalizeWord(
              state.action ?? this.statusConfig.unknown,
            ),
          }
        default:
          throw new Error('Wrong interaction type for flow')
      }
    })
  }

  private assembleAuthenticationSteps() {
    const { initiator } = this.summary
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
      description: this.statusConfig.unknown,
    }))
  }

  private processSteps() {
    switch (this.flowType) {
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
