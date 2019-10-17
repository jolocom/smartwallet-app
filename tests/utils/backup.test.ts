import { createBackup, decryptBackup } from '../../src/utils/backup'
import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
import {
  IKeyDerivationArgs,
  KeyTypes,
} from 'jolocom-lib/js/vaultedKeyProvider/types'
// @ts-ignore
import { testCreds } from '../lib/testData/filterTestData'

describe('Backup', () => {
  let vault: SoftwareKeyProvider
  let derivationArgs: IKeyDerivationArgs
  beforeAll(() => {
    vault = SoftwareKeyProvider.recoverKeyPair(
      'unusual empty journey convince crouch castle private march dune auction middle gloom',
      'secret',
    ) as SoftwareKeyProvider
    derivationArgs = {
      derivationPath: KeyTypes.jolocomIdentityKey,
      encryptionPass: 'secret',
    }
  })

  it('should encrypt and decrypt', async () => {
    const data = {
      did: 'did:jolo:testidstring',
      credentials: testCreds.map(c => c.toJSON()),
    }
    const backup = await createBackup(
      data.did,
      data.credentials,
      vault,
      derivationArgs,
    )
    console.log(backup)

    const recoveredData = JSON.parse(
      await decryptBackup(JSON.parse(backup), vault, derivationArgs),
    )
    expect(recoveredData).toEqual(data)
  })
})
