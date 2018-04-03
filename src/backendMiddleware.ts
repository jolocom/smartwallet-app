const JolocomLib = require('jolocom-lib')

export class BackendMiddleware {
  jolocomLib: any

  constructor(config: object) {
    this.jolocomLib = new JolocomLib(config)
  }
}
