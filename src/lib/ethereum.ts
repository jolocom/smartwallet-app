const wif = require('wif')
const wallet = require('ethereumjs-wallet')

interface DecodedWif {
  privateKey: string
  address: string 
}

export interface EthereumLibInterface {
  requestEther: (address: string) => Promise<void>
  privKeyToEthAddress: (privateKey: Buffer) => string
  wifToEthereumKey: (wifEncodedKey: string) => DecodedWif
}

export class EthereumLib implements EthereumLibInterface  {
  private fuelingEndpoint: string

  constructor(fuelingEndpoint: string) {
    this.fuelingEndpoint = fuelingEndpoint
  }

  async requestEther(address: string) {
    return fetch(this.fuelingEndpoint, {
      method: 'POST',
      body: JSON.stringify({ address }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (!res.ok) {
        throw new Error('Fueling with Ether not successfull')
      }
    })
  }

  privKeyToEthAddress(privateKey: Buffer) : string {
    const w = wallet.fromPrivateKey(privateKey)
    return `0x${w.getAddress().toString('hex')}`
  }

  // TODO: remove
  wifToEthereumKey(wifEncodedKey: string) : DecodedWif {
    const { privateKey } = wif.decode(wifEncodedKey)
    const w = wallet.fromPrivateKey(privateKey)

    return {
      privateKey: privateKey.toString('hex'),
      address: `0x${w.getAddress().toString('hex')}`
    }
  }
}
