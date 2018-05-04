import { IipfsConnector } from 'jolocom-lib'
const RNFetchBlob = require('react-native-fetch-blob').default

export class IpfsLib implements IipfsConnector {
  private nativeLib = RNFetchBlob
  private ipfsHost!: string

  configure(config: {host: string, protocol: string, port: number}) : void {
    this.ipfsHost = `${config.protocol}://${config.host}`
  }

  async storeJSON(ddo: object, pin: boolean) : Promise<string> {
    const endpoint = `${this.ipfsHost}/api/v0/add?pin=${pin}`
    const headers = { 'Content-Type': 'multipart/form-data' }

    const res = await this.nativeLib.fetch('POST', endpoint, headers, [{
      name: 'ddo',
      data: JSON.stringify(ddo)
    }])

    return res.json().Hash
  }

  // TODO Implement
  async catJSON(hash: string) : Promise<object> {
    return {}
  }

  // TODO Implement
  async removePinnedHash(hash: string) : Promise<void> {
  }
}

