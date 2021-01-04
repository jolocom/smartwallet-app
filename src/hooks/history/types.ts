import { IdentitySummary, FlowType } from 'react-native-jolocom'

export interface IInteractionDetails {
  type: FlowType
  issuer: IdentitySummary
  time: string
}

export interface IHistorySection {
  title: string
  data: string[]
}

/* TODO: think about a better name */
export interface IPreLoadedInteraction {
  id: string
  section: string
  type: FlowType
}
