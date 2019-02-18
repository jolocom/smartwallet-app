import { JolocomLib } from 'jolocom-lib'
import { IdentityWallet } from 'jolocom-lib/js/identityWallet/identityWallet'
import { EthereumLib, EthereumLibInterface } from 'src/lib/ethereum'
import { EncryptionLib, EncryptionLibInterface } from 'src/lib/crypto'
import { Storage } from 'src/lib/storage/storage'
import { KeyChain, KeyChainInterface } from 'src/lib/keychain'
import { ConnectionOptions } from 'typeorm/browser'
import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
import { DidDocument } from 'jolocom-lib/js/identity/didDocument/didDocument'
import { Identity } from 'jolocom-lib/js/identity/identity'

export class BackendMiddleware {
  identityWallet!: IdentityWallet
  ethereumLib: EthereumLibInterface
  storageLib: Storage
  encryptionLib: EncryptionLibInterface
  keyChainLib: KeyChainInterface

  constructor(config: { fuelingEndpoint: string, typeOrmConfig: ConnectionOptions }) {
    this.ethereumLib = new EthereumLib(config.fuelingEndpoint)
    this.storageLib = new Storage(config.typeOrmConfig)
    this.encryptionLib = new EncryptionLib()
    this.keyChainLib = new KeyChain()
  }

  async setIdentityWallet(userVault: SoftwareKeyProvider, pass: string): Promise<void> {
    console.log('start set')
    const { jolocomIdentityKey } = JolocomLib.KeyTypes
    const registry = JolocomLib.registries.jolocom.create()
    const pubKey = userVault.getPublicKey({
      encryptionPass: pass,
      derivationPath: jolocomIdentityKey
    })
    const keyArgs = {
      encryptionPass: pass,
      derivationPath: jolocomIdentityKey,
      keyId: pubKey.toString('hex')
    }

    const personas = await this.storageLib.get.persona()
    console.log(personas)
    console.log(keyArgs)

    if (personas.length) {
      this.identityWallet = new IdentityWallet({
        vaultedKeyProvider: userVault,
        identity: Identity.fromDidDocument({
          didDocument: DidDocument.fromPublicKey(pubKey)
        }),
        publicKeyMetadata: keyArgs
      })
    } else {
      try {
        this.identityWallet = await registry.authenticate(userVault, keyArgs)
      } catch(err) {
        console.log(err)
      }
    }

    console.warn(this.identityWallet)
  }
}
