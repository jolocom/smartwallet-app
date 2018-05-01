import JolocomLib from 'jolocom-lib'
import { IConfig } from 'jolocom-lib'
import { EthereumLib } from 'src/lib/ethereum'
import { EncryptionLib } from 'src/lib/crypto'
import { Storage } from 'src/lib/storage'
import { KeyChain, KeyChainLib } from 'src/lib/keychain'


export class BackendMiddleware {
  jolocomLib: any
  ethereumLib: any
  storageLib: any
  encryptionLib: any
  keyChainLib: KeyChainLib

  constructor(config: { jolocomLibConfig: IConfig, fuelingEndpoint: string }) {
    this.jolocomLib = new JolocomLib(config.jolocomLibConfig)
    this.ethereumLib = new EthereumLib(config.fuelingEndpoint)
    this.storageLib = new Storage(),
    this.encryptionLib = new EncryptionLib(),
    this.keyChainLib = new KeyChain()
  }
}
