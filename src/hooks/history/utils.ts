import moment from 'moment'
import { IInteractionWithSection, IHistorySection } from './types'

export const filterUniqueById = (array: IInteractionWithSection[]) =>
  Array.from(new Set(array.map((i) => i.id))).map((i) => ({
    id: i,
    section: array.find((id) => i === id.id)?.section!,
  }))

export const getDateSection = (date: Date) =>
  moment(date).calendar(null, {
    sameDay: '[Today]',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'DD/MM/YYYY',
  })

export const groupBySection = (interactions: IInteractionWithSection[]) =>
  interactions.reduce<IHistorySection[]>((acc, v) => {
    console.log({ v })
    const section = acc.find((s) => s.section === v.section) || {
      section: v.section,
      data: [],
    }
    const filteredAcc = acc.filter((s) => s.section !== v.section)
    section.data.push(v.id)
    filteredAcc.push(section)
    return filteredAcc
  }, [])
