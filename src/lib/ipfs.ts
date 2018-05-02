import { IipfsConnector } from 'jolocom-lib'
const RNFetchBlob = require('react-native-fetch-blob').default

export class IpfsLib implements IipfsConnector {
  private nativeLib : any = RNFetchBlob
  private ipfsHost!: string

  configure(config: {host: string, protocol: string, port: number}) : void {
    this.ipfsHost = `${config.protocol}://${config.host}`
  }

  async storeJSON(ddo: any, pin: boolean) : Promise<string> {
    const endpoint = `${this.ipfsHost}/api/v0/add?pin=${pin}`
    const headers = { 'Content-Type': 'multipart/form-data' }

    const res = await this.nativeLib.fetch('POST', endpoint, headers, [{
      name: 'ddo',
      data: JSON.stringify(ddo)
    }])

    return res.json().Hash
  }

  async catJSON(hash: string) : Promise<any> {
  }

  async removePinnedHash(hash: string) : Promise<void> {
  }
}

