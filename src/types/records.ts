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

export interface IHistorySectionData {
  id: string
  // NOTE: lastUpdate is needed to make sure the item in the list
  // is re-rendered after it's updated with a new interaction token
  lastUpdate: string
}

export interface IHistorySection {
  title: string
  data: IHistorySectionData[]
}

/* TODO: think about a better name */
export interface IPreLoadedInteraction {
  id: string
  section: string
  type: FlowType
  lastUpdate: string
}

export interface IFlowRecordConfig {
  title: string
  steps: {
    finished: string[]
    unfinished: string[]
  }
}

export interface IStatusRecordConfig {
  unknown: string
  pending: string
  expired: string
}

export interface IRecordConfig {
  status: IStatusRecordConfig
  flows: Partial<Record<FlowType, IFlowRecordConfig>>
}
