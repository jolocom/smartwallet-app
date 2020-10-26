// @ts-ignore no declaration file
import { randomBytes } from 'react-native-randombytes'

export function generateSecureRandomBytes(length: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    randomBytes(length, (err: string, bytesAsBase64: string) => {
      if (err) reject(err)
      else resolve(Buffer.from(bytesAsBase64, 'base64'))
    })
  })
}
