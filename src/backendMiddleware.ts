import JolocomLib from 'jolocom-lib'
import { IConfig } from 'jolocom-lib'
import { EthereumLib } from 'src/lib/ethereum'

export class BackendMiddleware {
  jolocomLib: any
  ethereumLib: any

  constructor(config: { jolocomLibConfig: IConfig, fuelingEndpoint: string }) {
    this.jolocomLib = new JolocomLib(config.jolocomLibConfig)
    this.ethereumLib = new EthereumLib(config.fuelingEndpoint)
  }
}
