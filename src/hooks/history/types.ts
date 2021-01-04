import { IdentitySummary, FlowType } from 'react-native-jolocom'

export enum InteractionStatus {
  pending = 'pending',
  finished = 'finished',
  failed = 'expired',
}

export interface InteractionStep {
  title: string
}

export interface IInteractionDetails {
  type: FlowType
  issuer: IdentitySummary
  // status: InteractionStatus
  // steps: InteractionStep
  time: string
}

export interface IHistorySection {
  section: string
  data: string[]
}

export interface IInteractionWithSection {
  id: string
  section: string
}
