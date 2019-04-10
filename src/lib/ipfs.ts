import { IIpfsConnector } from 'jolocom-lib/js/ipfs/types'
import { IDidDocumentAttrs } from 'jolocom-lib/js/identity/didDocument/types'
const RNFetchBlob = require('react-native-fetch-blob').default

export class IpfsCustomConnector implements IIpfsConnector {
  private nativeLib = RNFetchBlob
  private ipfsHost!: string

  constructor(config: { host: string; protocol: string; port: number }) {
    this.ipfsHost = `${config.protocol}://${config.host}:${config.port}`
  }

  async storeJSON({
    data,
    pin,
  }: {
    data: object
    pin: boolean
  }): Promise<string> {
    if (!data || typeof data !== 'object') {
      throw new Error(`JSON expected, received ${typeof data}`)
    }

    // TODO: clarify if we need formData
    // const formData = new FormData()
    // formData.append('file', Buffer.from(JSON.stringify(data)))

    const endpoint = `${this.ipfsHost}/api/v0/add?pin=${pin}`
    const headers = { 'Content-Type': 'multipart/form-data' }

    const res = await this.nativeLib.fetch('POST', endpoint, headers, [
      {
        name: 'ddo',
        data: JSON.stringify(data),
      },
    ])
    return res.json().Hash
  }

  async catJSON(hash: string): Promise<IDidDocumentAttrs> {
    const endpoint = `${this.ipfsHost}/api/v0/cat?arg=${hash}`
    const res = await this.nativeLib.fetch('GET', endpoint)
    return res.json()
  }

  async removePinnedHash(hash: string): Promise<void> {
    const resolutionGateway = 'https://ipfs.io/ipfs/'
    const endpoint = `${resolutionGateway}/${hash}`
    const res = this.nativeLib.fetch('GET', endpoint)

    if (!res.ok) {
      throw new Error(
        `Removing pinned hash ${hash} failed, status code: ${res.status}`,
      )
    }
  }

  async createDagObject({
    data,
    pin,
  }: {
    data: object
    pin: boolean
  }): Promise<string> {
    if (!data || typeof data !== 'object') {
      throw new Error(`Object expected, received ${typeof data}`)
    }

    const formData = new FormData()
    formData.append('file', Buffer.from(JSON.stringify(data)))

    const endpoint = `${this.ipfsHost}/api/v0/dag/put?pin=${pin}`
    const headers = { 'Content-Type': 'multipart/form-data' }

    const res = this.nativeLib.fetch('POST', endpoint, headers, [
      {
        name: 'dag',
        data: formData,
      },
    ])

    return res.json().Cid['/']
  }

  async resolveIpldPath(pathToResolve: string): Promise<object> {
    const endpoint = `${this.ipfsHost}/api/v0/dag/get?arg=${pathToResolve}`
    const res = this.nativeLib.fetch('GET', endpoint)

    return res.json()
  }
}
