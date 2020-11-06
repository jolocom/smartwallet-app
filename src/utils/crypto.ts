import crypto from 'crypto'

export const hashString = (text: string) => {
  return crypto.createHash('sha256').update(text).digest('hex')
}
