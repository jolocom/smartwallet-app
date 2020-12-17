import { IdentitySummary, FlowType } from 'react-native-jolocom'

export interface IInteractionDetails {
  type: FlowType
  issuer: IdentitySummary
  time: string
}

export interface IHistorySection {
  section: string
  data: string[]
}

export interface IInteractionWithSection {
  id: string
  section: string
  type: FlowType
}
