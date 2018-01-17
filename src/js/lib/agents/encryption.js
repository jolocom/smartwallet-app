const crypto = require('crypto')
const scryptsy = require('scrypt-async')

export default class EncryptionAgent {
  // encryption / decryption works in two steps
  // 1st step: derive a strong key from user password
  // 2nd step: encrypt / decrypt information with derived key

  async encryptInformation({password, data}) {
    if (typeof data === 'object' && data !== null) {
      data = JSON.stringify(data)
    }

    const salt = crypto.randomBytes(32)
    const iv = crypto.randomBytes(16)
    const key = await this._constructEncryptionKey(password, salt)

    const cipher = crypto.createCipheriv(
      'aes-128-ctr',
      key.derivedKey.slice(0, 16),
      iv
    )

    const ciphertext = Buffer.concat([
      cipher.update(data),
      cipher.final()
    ])

    const result = {
      crypto: {
        ciphertext: ciphertext.toString('hex'),
        cipherparams: {
          iv: iv.toString('hex')
        },
        cipher: 'aes-128-ctr',
        kdf: 'scrypt',
        kdfParams: key.kdfParams
      }
    }
    return result
  }

  _constructEncryptionKey(password, salt) {
    return new Promise((resolve, reject) => {
      var kdfParams = {
        derivationKeyLength: 32,
        salt: salt.toString('hex'),
        n: 262144,
        r: 8,
        p: 1
      }

      return scryptsy(password, salt.toString('hex'), {
        N: kdfParams.n,
        r: kdfParams.r,
        p: kdfParams.p,
        dkLen: kdfParams.derivationKeyLength,
        interruptStep: 1000,
        encoding: 'hex'
      }, derivedKey => resolve({derivedKey, kdfParams}))
    })
  }

  async decryptInformation({ciphertext, password, salt, iv}) {
    const key = await this._constructEncryptionKey(password, salt) // eslint-disable-line max-len

    const decipher = crypto.createDecipheriv(
      'aes-128-ctr',
      key.derivedKey.slice(0, 16),
      Buffer.from(iv, 'hex')
    )

    const plaintext = decipher.update(ciphertext, 'hex', 'utf-8')

    try {
      return JSON.parse(plaintext)
    } catch (e) {
      return plaintext
    }
  }
}
