// NOTE: the first unfinished step will never be used, due to the fact
import { IRecordConfig } from './types'
import {
  getDateSection,
  filterUniqueById,
  interactionTypeToFlowType,
} from './utils'
import { FlowType } from '@jolocom/sdk'

// that there is always a request i.e. first step.
export const recordConfig: Partial<Record<FlowType, IRecordConfig>> = {
  [FlowType.Authentication]: {
    title: 'Authentication',
    steps: {
      finished: ['Requested', 'Confirmed'],
      unfinished: ['Not requested', 'Not confirmed'],
    },
  },
  [FlowType.Authorization]: {
    title: 'Authorization',
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
