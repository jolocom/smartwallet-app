import WalletCrypto from 'smartwallet-contracts/lib/wallet-crypto'
import {randomUint8Array} from 'secure-random'
import * as settings from 'settings'
import HTTPAgent from './http'

export default class VerificationAgent {
  constructor() {
    this.httpAgent = new HTTPAgent({proxy: false})
  }

  async startVerifyingEmail({wallet, email, id, pin}) {
    return await this._startVerifying({
      wallet, pin, dataType: 'email', data: email
    })
  }

  async startVerifyingPhone({wallet, phone, id, pin}) {
    return await this._startVerifying({
      wallet, pin, dataType: 'phone', data: phone
    })
  }

  async _startVerifying({wallet, data, id, dataType, pin}) {
    await this.httpAgent.post(
      settings.verificationProvider + `/${dataType}/start-verification`,
      {
        identity: wallet.identityURL,
        id,
        [dataType]: data
      }
    )
  }

  async verifyEmail({contractID, email, id, code}) {
    await this._verify({contractID, dataType: 'email', id, data: email, code})
  }

  async verifyPhone({contractID, phone, id, code}) {
    await this._verify({contractID, dataType: 'phone', id, data: phone, code})
  }

  async _verify({wallet, dataType, id, data, code}) {
    await this.httpAgent.post(
      settings.verificationProvider + `/${dataType}/verify`,
      {
        identity: wallet.identityURL,
        id,
        [dataType]: data,
        code
      }
    )

    localStorage.deleteItem(getDataKey({dataType, data}))
  }
}

function saltAndHash(data) {
  const randomBuffer = randomUint8Array(10)
  const decoder = new TextDecoder('utf8')
  const salt = btoa(decoder.decode(randomBuffer))
  const hash = (new WalletCrypto()).sha256(data + salt)

  return {salt, hash}
}

async function sendVerificationEtherIfNeeded({wallet, dataType, data, pin}) {
  const dataKey = getDataKey({dataType, data})
  const stored = localStorage.getItem(dataKey)
  if (stored) {
    const storedData = JSON.parse(stored)
    return {
      salt: storedData.salt,
      txHash: storedData.txHash
    }
  }

  const {salt, hash} = saltAndHash(data)

  const txHash = await wallet.sendEther({
    receiver: settings.jolocomIdentityWalletAddress,
    amountEther: 0.005,
    data: hash,
    pin
  })

  localStorage.setItem(dataKey, JSON.stringify({
    txHash, salt, hash, data
  }))

  return {salt, txHash}
}

function getDataKey({dataType, data}) {
  return `jolocom.verification.${dataType}.${data}`
}
