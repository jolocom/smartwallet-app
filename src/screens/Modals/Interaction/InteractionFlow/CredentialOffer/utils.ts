export const separateIntoSections = (sections, details) => {
  if (!details) return { documents: [], other: [] }
  return details.reduce(
    (acc, v) => {
      // TODO: generalize fn
      if (sections.documents.find((d) => d.type === v.name)) {
        acc.documents = [...acc.documents, v]
        // TODO: generalize fn
      } else if (sections.documents.find((o) => o.type === v.name)) {
        acc.other = [...acc.other, v]
      }
      return acc
    },
    { documents: [], other: [] },
  ) // TODO: add keys dynamically
}
