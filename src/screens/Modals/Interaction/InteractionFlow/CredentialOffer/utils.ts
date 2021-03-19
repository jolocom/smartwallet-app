import { DocumentTypes, OfferedCredential } from '~/types/credentials'
import { IIncomingCard } from '~/screens/Modals/Interaction/InteractionFlow/components/card/types'

export const separateIntoSections = <T extends IIncomingCard>(
  sections: Record<DocumentTypes, OfferedCredential[]>,
  details: T[] | null,
) => {
  const initial = Object.keys(sections).reduce<Record<string, T[]>>(
    (acc, k) => {
      const key = k as DocumentTypes
      acc[key] = []
      return acc
    },
    {},
  )
  if (details === null) return initial
  if (!details) return { documents: [], other: [] }
  return details.reduce((acc, v) => {
    // NOTE: this is not adopted to dynamic section keys
    if (sections.document.find((d) => d.type[1] === v.name)) {
      acc.document = [...acc.document, v]
    } else if (sections.other.find((o) => o.type[1] === v.name)) {
      acc.other = [...acc.other, v]
    }
    return acc
  }, initial)
}
