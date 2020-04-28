const { RNRandomBytes } = NativeModules
import { NativeModules } from 'react-native'

export function generateSecureRandomBytes(length: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    RNRandomBytes.randomBytes(length, (err: string, bytesAsBase64: string) => {
      if (err) reject(err)
      else resolve(Buffer.from(bytesAsBase64, 'base64'))
    })
  })
}
