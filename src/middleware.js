import JolocomLib from 'jolocom-lib'

export class Middleware {
  jolocomLib: any

  constructor(config) {
    this.config = config
    this.jolocomLib = new JolocomLib(this.config)
  }
}
