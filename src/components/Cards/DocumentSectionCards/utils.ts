export const splitFields = <T>(fields: Array<T>) => {
  const halfway = Math.ceil(fields.length / 2)
  const last = fields.splice(halfway, fields.length)
  const first = fields.splice(0, halfway)

  return [first, last]
}
