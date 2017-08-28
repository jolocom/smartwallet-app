import EventEmitter from 'events'
import sjcl from 'sjcl'
import * as settings from 'settings'

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
            gateway: this.backend
          })
        })
      }
    }
  }

  async login({seedPhrase, pin}) {
    const res = await this.backend.login({seedPhrase, pin})

    const walletConfig = {
      encryptedSeedPhrase: sjcl.encrypt(pin, seedPhrase),
      userName: res.userName
    }

    this._localStorage.setItem('jolocom.identity', JSON.stringify(walletConfig))
    this._setCurrentUser({
      wallet: new Wallet({
        ...walletConfig,
        gateway: this.backend
      })
    })
  }

  register({userName, seedPhrase}) {
    return this.backend.register({userName, seedPhrase})
  }

  _setCurrentUser(user) {
    this.currentUser = user
    this.emit('changed', user)
  }

  getSeedPhrase(pin) {
    return sjcl.decrypt(pin, this.currentUser.wallet.encryptedSeedPhrase)
  }
}

export class Wallet {
  constructor({gateway, userName, encryptedSeedPhrase}) {
    this._gateway = gateway
    this.userName = userName
    this.identityURL = `${settings.gateway}/${userName}`
    this.encryptedSeedPhrase = encryptedSeedPhrase
  }

  getMainAddress() {
    return this._gateway.getMainAddress({
      userName: this.userName,
      seedPhrase: this.seedPhrase
    })
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
      const [email, phone, passport, idcard] =
        await this._gateway.getOwnAttributes({
          userName: this.userName,
          type: ['email', 'phone', 'passport', 'idcard'],
          checkVerified: true
        })

      return {
        webId: `https://${this.userName}.webid.jolocom.de/profile/card#me`,
        userName: this.userName,
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
        passports: passport.map(passport => ({
          ...passport.contents,
          verified: passport.verified,
          savedToBlockchain: false
        })),
        idCards: idcard.map(idcard => ({
          idCardFields: idcard.contents,
          verified: idcard.verified,
          savedToBlockchain: false,
          id: idcard.id
        }))
      }
    } catch (e) {
      console.error(e)
      console.trace()
      throw e
    }
  }
}
