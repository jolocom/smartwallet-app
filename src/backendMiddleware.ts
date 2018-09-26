import { JolocomLib } from 'jolocom-lib'
import { IdentityWallet } from 'jolocom-lib/js/identityWallet/identityWallet'
import { EthereumLib, EthereumLibInterface } from 'src/lib/ethereum'
import { EncryptionLib, EncryptionLibInterface } from 'src/lib/crypto'
import { Storage } from 'src/lib/storage/storage'
import { KeyChain, KeyChainInterface } from 'src/lib/keychain'

// TODO Type config better
export class BackendMiddleware {
  identityWallet!: IdentityWallet
  ethereumLib: EthereumLibInterface
  storageLib: Storage
  encryptionLib: EncryptionLibInterface
  keyChainLib: KeyChainInterface

  constructor(config: { fuelingEndpoint: string, typeOrmConfig: any }) {
    this.ethereumLib = new EthereumLib(config.fuelingEndpoint)
    this.storageLib = new Storage(config.typeOrmConfig),
    this.encryptionLib = new EncryptionLib(),
    this.keyChainLib = new KeyChain()
  }

  async setIdentityWallet(privKey: Buffer): Promise<void> {
    const registry = JolocomLib.registry.jolocom.create()
    this.identityWallet = await registry.authenticate(privKey) 
  }
}