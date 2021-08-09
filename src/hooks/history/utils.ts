import { TFunction } from 'i18next'
import moment from 'moment'
import { FlowType } from 'react-native-jolocom'
import {
  IPreLoadedInteraction,
  IHistorySection,
  IHistorySectionData,
  IRecordConfig,
} from '~/types/records'

export const getDateSection = (date: Date) =>
  moment(date).calendar(null, {
    sameDay: '[Dates.today]',
    lastDay: '[Dates.yesterday]',
    lastWeek: '[Dates.last]dddd',
    sameElse: 'DD/MM/YYYY',
  })

export const groupBySection = (
  array: IPreLoadedInteraction[],
): IHistorySection[] => {
  const groupedObj = array.reduce<Record<string, IHistorySectionData[]>>(
    (acc, v) => {
      acc[v.section] = acc[v.section]
        ? [...acc[v.section], { id: v.id, lastUpdate: v.lastUpdate }]
        : [{ id: v.id, lastUpdate: v.lastUpdate }]
      return acc
    },
    {},
  )

  return Object.keys(groupedObj).map((title) => ({
    title,
    data: groupedObj[title],
  }))
}

export const recordConfig = {
  status: {
    unknown: 'General.unknown',
    expired: 'History.expiredState',
    pending: 'History.pendingState',
  },
  flows: {
    [FlowType.Authentication]: {
      title: 'History.authenticationHeader',
      steps: {
        finished: [
          'History.authenticationRequestStepHeader',
          'History.authResponseStepHeader',
        ],
        unfinished: [
          'History.authenticationRequestStepHeader',
          'History.authResponseStepHeader',
        ],
      },
    },
    [FlowType.Authorization]: {
      title: 'History.authzHeader',
      steps: {
        finished: [
          'History.authzRequestStepHeader',
          'History.authzResponseStepHeader',
        ],
        unfinished: [
          'History.authzRequestStepHeader',
          'History.authzResponseStepHeader',
        ],
      },
    },
    [FlowType.CredentialOffer]: {
      title: 'History.credentialOfferHeader',
      steps: {
        finished: [
          'History.offerRequestStepHeader',
          'History.offerResponseStepHeader',
          'History.offerReceiveStepHeader',
        ],
        unfinished: [
          'History.offerRequestStepHeader',
          'History.offerResponseStepHeader',
          'History.offerReceiveStepHeader',
        ],
      },
    },
    [FlowType.CredentialShare]: {
      title: 'History.credShareHeader',
      steps: {
        finished: [
          'History.credShareRequestStepHeader',
          'History.credShareResponseStepHeader',
        ],
        unfinished: [
          'History.credShareRequestStepHeader',
          'History.credShareResponseStepHeader',
        ],
      },
    },
  },
}

type TRecordConfig = Record<string, string | string[] | TRecordConfig>

export const translateRecordConfig = (t: TFunction): IRecordConfig => {
  function traverseConfig(config: TRecordConfig) {
    return Object.keys(config).reduce<TRecordConfig>(
      (translatedConfig, key) => {
        if (typeof config[key] === 'string') {
          translatedConfig[key] = t(config[key])
        } else if (Array.isArray(config[key])) {
          translatedConfig[key] = config[key].map((s: string) => {
            if (key === 'unfinished') {
              return t('History.notFinishedStepHeader', {
                text: t(s).toLowerCase(),
              })
            }
            return t(s)
          })
        } else {
          translatedConfig[key] = traverseConfig(config[key])
        }
        return translatedConfig
      },
      {},
    )
  }
  return traverseConfig(recordConfig) as IRecordConfig
}
