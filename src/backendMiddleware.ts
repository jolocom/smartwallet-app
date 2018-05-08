import JolocomLib from 'jolocom-lib'
import { IConfig } from 'jolocom-lib'
import { EthereumLib, EthereumLibInterface } from 'src/lib/ethereum'
import { EncryptionLib, EncryptionLibInterface } from 'src/lib/crypto'
import { Storage, StorageInterface } from 'src/lib/storage'
import { KeyChain, KeyChainInterface } from 'src/lib/keychain'

export class BackendMiddleware {
  jolocomLib: JolocomLib
  ethereumLib: EthereumLibInterface
  storageLib: StorageInterface
  encryptionLib: EncryptionLibInterface
  keyChainLib: KeyChainInterface

  constructor(config: { jolocomLibConfig: IConfig, fuelingEndpoint: string }) {
    this.jolocomLib = new JolocomLib(config.jolocomLibConfig)
    this.ethereumLib = new EthereumLib(config.fuelingEndpoint)
    this.storageLib = new Storage(),
    this.encryptionLib = new EncryptionLib(),
    this.keyChainLib = new KeyChain()
  }
}
