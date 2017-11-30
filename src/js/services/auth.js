import io from 'socket.io-client'
import EventEmitter from 'events'

export default class AuthService extends EventEmitter {
  constructor(backend) {
    super()
    this.backend = backend
    this.currentUser = null
    this._localStorage = localStorage

    if (typeof localStorage !== 'undefined') {
      const savedSession = localStorage.getItem('jolocom.identity')
      if (savedSession) {
        this._setCurrentUser({
          wallet: new Wallet({
            ...JSON.parse(savedSession),
            gateway: this.backend.gateway
          })
        })
      }
    }
  }

  async login({seedPhrase, gatewayUrl}) {
    if (gatewayUrl !== undefined && gatewayUrl.length > 11) {
      this.backend.gateway = gatewayUrl
      console.log(gatewayUrl)
    }
    const res = await this.backend.gateway.login({seedPhrase})
    if (!res.success) {
      throw new Error('Could not log in: invalid seed phrase')
    }

    const walletConfig = {
      seedPhrase: seedPhrase,
      userName: res.userName
    }

    this._localStorage.setItem('jolocom.identity', JSON.stringify(walletConfig))
    this._setCurrentUser({
      wallet: new Wallet({
        ...walletConfig,
        gateway: this.backend.gateway
      })
    })
  }

  register({userName, seedPhrase, gatewayUrl, inviteCode}) {
    if (gatewayUrl !== undefined && gatewayUrl.length > 11) {
      this.backend.gateway = gatewayUrl
    }
    return this.backend.gateway.register({userName, seedPhrase, inviteCode})
  }

  _setCurrentUser(user) {
    const oldUser = this.currentUser
    this.currentUser = user
    this._initSocket()
    this.emit('changed', {oldUser, newUser: user})

    if (oldUser && !this.currentUser) {
      oldUser.socket.close()
    }
  }

  _initSocket() {
    this.currentUser.socket = io(new URL(
      this.currentUser.wallet.identityURL).origin
    )
  }
}

export class Wallet {
  constructor({gateway, userName, seedPhrase}) {
    this._gateway = gateway
    this.userName = userName
    this.identityURL = `${IDENTITY_GATEWAY_URL}/${userName}`
    this.seedPhrase = seedPhrase
  }

  getWalletAddress() {
    return this._gateway.getWalletAddress({userName: this.userName})
  }

  storeAttribute({attributeType, attributeData, attributeId}) {
    return this._gateway.storeAttribute({
      userName: this.userName,
      attributeType,
      attributeData,
      attributeId
    })
  }

  async deleteAttribute({attributeType, attributeId}) {
    return this._gateway.deleteAttribute({
      userName: this.userName,
      attributeType,
      attributeId
    })
  }

  proxyGet(requestUrl) {
    return this._gateway.proxyGet(requestUrl)
  }

  verify({identity, attributeType, attributeId, attributeValue}) {
    return this._gateway.verify({
      userName: this.userName,
      seedPhrase: this.seedPhrase,
      identity,
      attributeType,
      attributeId,
      attributeValue
    })
  }

  async getUserInformation() {
    try {
      let displayName
      try {
        displayName = await this._gateway.getDisplayName({
          userName: this.userName
        })
      } catch (e) {
        console.log(e)
        displayName = [['value', '']]
      }
      const [email, phone] =
        await this._gateway.getOwnAttributes({
          userName: this.userName,
          type: ['email', 'phone'],
          checkVerified: true
        })

      const ethereum = await this._gateway.getWalletAddress({
        userName: this.userName
      })

      const balanceEther = await this._gateway.getBalanceEther({
        userName: this.userName,
        walletAddress: ethereum.walletAddress
      })
      return {
        userName: this.userName,
        displayName: {
          edit: false,
          value: displayName[0][1]
        },
        contact: {
          email: email.map(email => ({
            id: email.id,
            address: email.contents.value,
            verified: email.verified,
            savedToBlockchain: false
          })),
          phone: phone.map(phone => ({
            id: phone.id,
            smsCode: '',
            codeIsSent: false,
            type: phone.contents.type,
            number: phone.contents.value,
            verified: phone.verified,
            savedToBlockchain: false
          }))
        },
        ethereum: {
          walletAddress: ethereum.walletAddress,
          identityAddress: ethereum.identityAddress,
          amount: balanceEther.ether
        }
      }
    } catch (e) {
      console.error(e)
      console.trace()
      throw e
    }
  }
}
