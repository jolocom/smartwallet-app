import { FlowType } from '@jolocom/sdk'
import { strings } from '~/translations'

export interface IRecordConfig {
  title: string
  steps: {
    finished: string[]
    unfinished: string[]
  }
}

// NOTE: the first unfinished step will never be used, due to the fact
// that there is always a request i.e. first step.
export const recordConfig: Partial<Record<FlowType, IRecordConfig>> = {
  [FlowType.Authentication]: {
    title: strings.AUTHENTICATION,
    steps: {
      finished: [strings.REQUESTED, strings.CONFIRMED],
      unfinished: [strings.NOT_REQUESTED, strings.NOT_CONFIRMED],
    },
  },
  [FlowType.Authorization]: {
    title: strings.AUTHORIZATION,
    steps: {
      finished: [strings.AUTHORIZED, strings.CONFIRMED],
      unfinished: [strings.NOT_AUTHORIZED, strings.NOT_CONFIRMED],
    },
  },
  [FlowType.CredentialOffer]: {
    title: strings.INCOMING_OFFER,
    steps: {
      finished: [strings.OFFERED, strings.SELECTED, strings.ISSUED],
      unfinished: [
        strings.NOT_OFFERED,
        strings.NOT_SELECTED,
        strings.NOT_ISSUED,
      ],
    },
  },
  [FlowType.CredentialShare]: {
    title: strings.INCOMING_REQUEST,
    steps: {
      finished: [strings.REQUESTED, strings.SHARED],
      unfinished: [strings.NOT_REQUESTED, strings.NOT_SHARED],
    },
  },
}
