const crypto = require('crypto')
const scryptsy = require('scryptsy')

export default class EncryptionAgent {
  // encryption / decryption works in two steps
  // 1st step: derive a strong key from user password
  // 2nd step: encrypt / decrypt information with derived key

  async encryptInformation({password, data}) {
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
      var derivedKey
      var kdfParams = {
        dervationKeyLength: 32, // suitable for a 256 bit aes key
        salt: salt.toString('hex')
      }
      kdfParams.n = 262144 // number of iterations
      kdfParams.r = 8 // memory factor
      kdfParams.p = 1 // parallelization factor

      derivedKey = scryptsy(
        Buffer.from(password),
        salt,
        kdfParams.n,
        kdfParams.r,
        kdfParams.p,
        kdfParams.dervationKeyLength
      )

      resolve({derivedKey, kdfParams})
    })
  }

  async decryptInformation({ciphertext, password, salt, iv}) {
    const key = await this._constructEncryptionKey(password, Buffer.from(salt, 'hex')) // eslint-disable-line max-len

    const decipher = crypto.createDecipheriv(
      'aes-128-ctr',
      key.derivedKey.slice(0, 16),
      Buffer.from(iv, 'hex')
    )

    const plaintext = decipher.update(ciphertext, 'hex', 'utf-8')
    return plaintext
  }
}
