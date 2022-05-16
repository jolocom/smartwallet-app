import { DisplayVal } from '@jolocom/sdk/js/credentials'

export const splitFields = <T>(fields: Array<T>) => {
  const halfway = Math.ceil(fields.length / 2)
  const last = fields.splice(halfway, fields.length)
  const first = fields.splice(0, halfway)

  return [first, last]
}

export const splitIntoRows = (
  fields: Required<DisplayVal>[],
  oneLineLimit: number,
) => {
  let lastPushedIdx = -1

  const rows = fields.reduce<Required<DisplayVal>[][]>(
    (acc, field, i, array) => {
      if (i > lastPushedIdx) {
        if (field.value.length >= oneLineLimit || i + 1 >= array.length) {
          acc.push([field])
          lastPushedIdx = i
        } else {
          acc.push([field, array[i + 1]])
          lastPushedIdx = i + 1
        }
      }

      return acc
    },
    [],
  )

  return rows
}
