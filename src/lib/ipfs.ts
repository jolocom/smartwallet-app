import { IIpfsConnector } from 'jolocom-lib/js/ipfs/types'
import { IDidDocumentAttrs } from 'jolocom-lib/js/identity/didDocument/types'
const RNFetchBlob = require('react-native-fetch-blob').default

export class IpfsLib implements IIpfsConnector {
  private nativeLib = RNFetchBlob
  private ipfsHost!: string

  configure(config: {host: string, protocol: string, port: number}) : void {
    this.ipfsHost = `${config.protocol}://${config.host}:${config.port}`
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

  async catJSON(hash: string) : Promise<IDidDocumentAttrs> {
    const endpoint = `${this.ipfsHost}/api/v0/cat?arg=${hash}`
    const res = await this.nativeLib.fetch('GET', endpoint)
    return res.json()
  }

  // TODO Implement
  async removePinnedHash(hash: string) : Promise<void> {
  }
}

