import moment from 'moment'
import {
  IPreLoadedInteraction,
  IHistorySection,
  IHistorySectionData,
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
