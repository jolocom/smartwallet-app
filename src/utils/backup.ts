import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
// @ts-ignore
import eccrypto from 'eccrypto'
import { ICredentialAttrs } from 'jolocom-lib/js/credentials/credential/types'

export interface BackupFile {
  key: string
  data: string
}

export async function createBackup(
  did: string,
  credentials: ICredentialAttrs[],
  publicKey: Buffer,
): Promise<string> {
  const data = {
    did,
    credentials,
  }
  const password = SoftwareKeyProvider.getRandom(128)
  // @ts-ignore private
  const encryptedData: Buffer = SoftwareKeyProvider.encrypt(
    password,
    JSON.stringify(data),
  )
  const encryptedKey = await eccrypto.encrypt(publicKey, Buffer.from(password))
  const backupFile: BackupFile = {
    key: stringifyEncryptedData(encryptedKey),
    data: encryptedData.toString('hex'),
  }
  return JSON.stringify(backupFile)
}

export async function decryptBackup(
  backupFile: BackupFile,
  privateKey: Buffer,
): Promise<string> {
  const key = await eccrypto.decrypt(
    privateKey,
    parseEncryptedData(backupFile.key),
  )
  // @ts-ignore private
  return SoftwareKeyProvider.decrypt(
    key,
    Buffer.from(backupFile.data, 'hex'),
  ).toString()
}

function stringifyEncryptedData(data: {
  iv: Buffer
  ephemPublicKey: Buffer
  ciphertext: Buffer
  mac: Buffer
}): string {
  const array = [
    data.iv.toString('hex'),
    data.ephemPublicKey.toString('hex'),
    data.ciphertext.toString('hex'),
    data.mac.toString('hex'),
  ]
  return array.join('::')
}

function parseEncryptedData(data: string): object {
  const array = data.split('::')
  return {
    iv: Buffer.from(array[0], 'hex'),
    ephemPublicKey: Buffer.from(array[1], 'hex'),
    ciphertext: Buffer.from(array[2], 'hex'),
    mac: Buffer.from(array[3], 'hex'),
  }
}
