import { JolocomLib } from 'jolocom-lib'
import { EthereumLib, EthereumLibInterface } from 'src/lib/ethereum'
import { EncryptionLib, EncryptionLibInterface } from 'src/lib/crypto'
// import { Storage } from 'src/lib/storage/storage'
import { KeyChain, KeyChainInterface } from 'src/lib/keychain'
//import { ILibConfig } from 'jolocom-lib/js/types'

// TODO Type config better
export class BackendMiddleware {
  jolocomLib: object
  ethereumLib: EthereumLibInterface
  // storageLib: Storage
  encryptionLib: EncryptionLibInterface
  keyChainLib: KeyChainInterface

  constructor(config: { fuelingEndpoint: string, typeOrmConfig: any }) {
    this.jolocomLib = JolocomLib
    this.ethereumLib = new EthereumLib(config.fuelingEndpoint)
    // this.storageLib = new Storage(config.typeOrmConfig),
    this.encryptionLib = new EncryptionLib(),
    this.keyChainLib = new KeyChain()
  }
}