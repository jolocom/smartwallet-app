import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
import {
  IKeyDerivationArgs,
  KeyTypes,
} from 'jolocom-lib/js/vaultedKeyProvider/types'
import * as crypto from 'crypto'

export const BACKUP_SERVER_URI = 'https://backup.jolocom.io'

export async function backupData(
  userData: any,
  softwareKeyProvider: SoftwareKeyProvider,
  password: string,
) {
  const derivationArgs: IKeyDerivationArgs = {
    derivationPath: KeyTypes.jolocomIdentityKey,
    encryptionPass: password,
  }
  const auth = generateAuthenticationData(softwareKeyProvider, password)
  //TODO encrypt userData
  const data = {
    keys: [
      {
        pubKey: softwareKeyProvider
          .getPublicKey(derivationArgs)
          .toString('hex'),
        cipher: 'encryptedKey',
      },
    ],
    data: 'hexData',
  }
  return await fetch(BACKUP_SERVER_URI + '/store-backup', {
    method: 'POST',
    body: JSON.stringify({ auth: auth, data: data }),
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function fetchBackup(
  softwareKeyProvider: SoftwareKeyProvider,
  password: string,
) {
  const auth = generateAuthenticationData(softwareKeyProvider, password)

  const response = await fetch(BACKUP_SERVER_URI + '/get-backup', {
    method: 'POST',
    body: JSON.stringify({ auth: auth }),
    headers: { 'Content-Type': 'application/json' },
  })
  const body = await response.json()
  if (response.status === 404) return null
  else if (response.status === 200) return body

  throw new Error(`Unexpected Response (${response.status}): ${body}`)
}

function generateAuthenticationData(
  softwareKeyProvider: SoftwareKeyProvider,
  password: string,
) {
  const derivationArgs: IKeyDerivationArgs = {
    derivationPath: KeyTypes.jolocomIdentityKey,
    encryptionPass: password,
  }
  const date = new Date().toISOString()
  const dateHash = crypto
    .createHash('sha256')
    .update(date)
    .digest()
  const sig = softwareKeyProvider.sign(derivationArgs, dateHash)

  return {
    pubKey: softwareKeyProvider.getPublicKey(derivationArgs).toString('hex'),
    date: date,
    sig: sig.toString('hex'),
  }
}
