import JolocomLib from 'jolocom-lib'
import { IConfig } from 'jolocom-lib'

export class BackendMiddleware {
  jolocomLib: any

  constructor(config: IConfig) {
    this.jolocomLib = new JolocomLib(config)
  }
}
