import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
// @ts-ignore
import eccrypto from 'eccrypto'
import { ICredentialAttrs } from 'jolocom-lib/js/credentials/credential/types'
import { IKeyDerivationArgs } from 'jolocom-lib/js/vaultedKeyProvider/types'

export interface BackupFile {
  keys: EncryptedKey[]
  data: string
}

export interface EncryptedKey {
  pubKey: string
  cipher: string
}

export async function createBackup(
  did: string,
  credentials: ICredentialAttrs[],
  vault: SoftwareKeyProvider,
  derivationArgs: IKeyDerivationArgs,
): Promise<string> {
  const data = {
    did,
    credentials,
    // TODO add more data here like e.g. interaction data
  }
  const publicKey = vault.getPublicKey(derivationArgs)

  const symKey = SoftwareKeyProvider.getRandom(128)
  // @ts-ignore private
  const encryptedData: Buffer = SoftwareKeyProvider.encrypt(
    symKey,
    JSON.stringify(data),
  )
  const encryptedKey = await eccrypto.encrypt(publicKey, Buffer.from(symKey))
  const backupFile: BackupFile = {
    keys: [
      {
        cipher: stringifyEncryptedData(encryptedKey),
        pubKey: publicKey.toString('hex'),
      },
    ],
    data: encryptedData.toString('hex'),
  }
  return JSON.stringify(backupFile)
}

export async function decryptBackup(
  backupFile: BackupFile,
  vault: SoftwareKeyProvider,
  derivationArg: IKeyDerivationArgs,
): Promise<string> {
  const publicKey = vault.getPublicKey(derivationArg)
  const privateKey = vault.getPrivateKey(derivationArg)
  // find encrypted key
  const encryptedKey = backupFile.keys.find(
    key => key.pubKey === publicKey.toString('hex'),
  )
  if (!encryptedKey) throw new Error('Not encrypted for these keys')
  const key = await eccrypto.decrypt(
    privateKey,
    parseEncryptedData(encryptedKey.cipher),
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
  let hexData = {}
  Object.keys(data).forEach(key => (hexData[key] = data[key].toString('hex')))
  return JSON.stringify(hexData)
}

function parseEncryptedData(data: string): object {
  const hexData = JSON.parse(data)
  let bufferData = {}
  Object.keys(hexData).forEach(
    key => (bufferData[key] = Buffer.from(hexData[key], 'hex')),
  )
  return bufferData
}
