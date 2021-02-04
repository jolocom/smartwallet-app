import moment from 'moment'
import { IPreLoadedInteraction, IHistorySection } from '~/types/records'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import { FlowType } from '@jolocom/sdk'

export const getDateSection = (date: Date) =>
  moment(date).calendar(null, {
    sameDay: '[Today]',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'DD/MM/YYYY',
  })

export const groupBySection = (
  array: IPreLoadedInteraction[],
): IHistorySection[] => {
  const groupedObj = array.reduce<Record<string, string[]>>((acc, v) => {
    acc[v.section] = acc[v.section] ? [...acc[v.section], v.id] : [v.id]
    return acc
  }, {})

  return Object.keys(groupedObj).map((title) => ({
    title,
    data: groupedObj[title],
  }))
}
