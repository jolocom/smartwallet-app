const wif = require('wif')
const wallet = require('ethereumjs-wallet')

export class EthereumLib  {
  private fuelingEndpoint: string

  constructor(fuelingEndpoint: string) {
    this.fuelingEndpoint = fuelingEndpoint
  }

  async requestEther(address: string) : Promise<Response> {
    return fetch(this.fuelingEndpoint, {
      method: 'POST',
      body: JSON.stringify({ address }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  wifToEthereumKey(wifEncodedKey: string) : any {
    const { privateKey } = wif.decode(wifEncodedKey)
    const w = wallet.fromPrivateKey(privateKey)

    return {
      privateKey: privateKey.toString('hex'),
      address: `0x${w.getAddress().toString('hex')}`
    }
  }
}

