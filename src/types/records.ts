import { IdentitySummary, FlowType } from 'react-native-jolocom'

export interface IRecordSteps {
  title: string
  description: string
}

export enum IRecordStatus {
  expired = 'expired',
  pending = 'pending',
  finished = 'finished',
}

export interface IRecordDetails {
  title: string
  issuer: IdentitySummary
  status: IRecordStatus
  steps: IRecordSteps[]
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
