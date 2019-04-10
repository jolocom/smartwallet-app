import { JolocomLib } from 'jolocom-lib'
import { IdentityWallet } from 'jolocom-lib/js/identityWallet/identityWallet'
import { EthereumLib, EthereumLibInterface } from 'src/lib/ethereum'
import { EncryptionLib, EncryptionLibInterface } from 'src/lib/crypto'
import { Storage } from 'src/lib/storage/storage'
import { KeyChain, KeyChainInterface } from 'src/lib/keychain'
import { ConnectionOptions } from 'typeorm/browser'
import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'

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
    const { jolocomIdentityKey } = JolocomLib.KeyTypes
    const registry = JolocomLib.registries.jolocom.create()
    this.identityWallet = await registry.authenticate(userVault, {
      encryptionPass: pass,
      derivationPath: jolocomIdentityKey
    })
  }
}