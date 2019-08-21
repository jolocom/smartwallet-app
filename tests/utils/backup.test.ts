import { createBackup, decryptBackup } from '../../src/utils/backup'
import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
import { KeyTypes } from 'jolocom-lib/js/vaultedKeyProvider/types'
// @ts-ignore
import eccrypto from 'eccrypto'
import { testCreds } from '../lib/testData/filterTestData'

describe('Backup', () => {
  let publicKey: Buffer
  let privateKey: Buffer
  beforeAll(() => {
    const vault = SoftwareKeyProvider.recoverKeyPair(
      'unusual empty journey convince crouch castle private march dune auction middle gloom',
      'secret',
    ) as SoftwareKeyProvider
    publicKey = vault.getPublicKey({
      derivationPath: KeyTypes.jolocomIdentityKey,
      encryptionPass: 'secret',
    })
    privateKey = vault.getPrivateKey({
      derivationPath: KeyTypes.jolocomIdentityKey,
      encryptionPass: 'secret',
    })
  })
  it('should encrypt and decrypt', async () => {
    const data = {
      did: 'did:jolo:testidstring',
      credentials: testCreds.map(c => c.toJSON()),
    }
    const backup = await createBackup(data.did, data.credentials, publicKey)

    const recoveredData = JSON.parse(
      await decryptBackup(JSON.parse(backup), privateKey),
    )
    expect(recoveredData).toEqual(data)
  })

  it('should test lib', async () => {
    // Encrypting the message for B.
    const encrypted = await eccrypto.encrypt(publicKey, Buffer.from('secret'))
    const stringEnc = JSON.stringify(encrypted)

    console.log(stringEnc)
    // B decrypting the message.
    const plain = await eccrypto.decrypt(privateKey, JSON.parse(stringEnc))
    console.log('Message to part B:', plain.toString())
  })
})
