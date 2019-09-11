/**
 * This is a compatibility layer for decrypting AES encrypted base64 encoded
 * strings from CryptoJS.AES.encrypt
 *
 * The wallet used to depend on crypto-js for en/decryption of the seed, but
 * then migrated to using the jolocom-lib (which uses crypto-browserify). The
 * details of the encryption (IV, key derivation) are slightly different, so
 * previously stored encrypted seeds needed to be re-encrypted.
 *
 */

import compatCryptoJS, { reencryptWithJolocomLib } from 'src/lib/compat/cryptojs'
import { JolocomLib } from 'jolocom-lib';

let CryptoJS: any
try {
  CryptoJS = require('crypto-js')
} catch (err) {
  // no crypto-js, most tests will be skipped
}

describe('CryptoJS compat utility', () => {
  describe('without crypto-js', () => {
    const seed = 'aa5cc59f97f97263c65b87b0bbbd0bfc'
    const pass = '20acTjPsC8vl9sSV1p8OMJrtEP85HK8B1MLIyiQdmRs='
    // const encrypted = CryptoJS.AES.encrypt(seed, pass).toString()
    const encrypted = "U2FsdGVkX18wk967sMVeGqhyPYZYDvMnr0HXKWd6VBbpunae+T5KGQdwFaTM8EL070ZKz2maesBjXYvJ6/LW7Q=="

    it('should decrypt stored encrypted entropy', () => {
      expect(compatCryptoJS.AES.decrypt(encrypted, pass).toString()).toEqual(seed)
    })

    it('should reencrypt with jolocom-lib', () => {
      const keyProviderFromSeed = JolocomLib.KeyProvider.fromSeed(Buffer.from(seed, 'hex'), pass)

      const reencrypted = reencryptWithJolocomLib(encrypted, pass)
      const keyProvider = new JolocomLib.KeyProvider(Buffer.from(reencrypted, 'hex'))
      const derivationArgs = {
        derivationPath: JolocomLib.KeyTypes.jolocomIdentityKey,
        encryptionPass: pass
      }

      expect(
        keyProvider.getPublicKey(derivationArgs)
      ).toEqual(
        keyProviderFromSeed.getPublicKey(derivationArgs)
      )
    })
  })

  if (!CryptoJS) return

  it('should parse cipher text like CryptoJS.format.OpenSSL.parse', () => {
    const message = 'hello'
    const pass = 'secret'

    const cipherText = walletEncrypt(message, pass)
    const res = CryptoJS.format.OpenSSL.parse(cipherText)
    const compatRes = compatCryptoJS.format.OpenSSL.parse(cipherText)
    expect(
      Buffer2Hex(compatRes.salt)
    ).toEqual(
      WordArray2Hex(res.salt)
    )
    expect(
      Buffer2Hex(compatRes.ciphertext)
    ).toEqual(
      WordArray2Hex(res.ciphertext)
    )
  })

  it('should create key and IV like CryptoJS.kdf.OpenSSL.execute', async () => {
    const message = 'hello'
    const pass = 'secret'
    const cipherText = walletEncrypt(message, pass)
    const keySize = 8
    const ivSize = 4

    const { salt } = CryptoJS.format.OpenSSL.parse(cipherText)
    const res = CryptoJS.kdf.OpenSSL.execute(pass, keySize, ivSize, salt)

    const { salt: compatSalt } = compatCryptoJS.format.OpenSSL.parse(cipherText)
    const compatRes = compatCryptoJS.kdf.OpenSSL.execute(pass, keySize, ivSize, compatSalt)

    expect(
      Buffer2Hex(compatRes.key)
    ).toEqual(
      WordArray2Hex(res.key)
    )
    expect(
      Buffer2Hex(compatRes.iv)
    ).toEqual(
      WordArray2Hex(res.iv)
    )
  })

  it('should decrypt like CryptoJS.AES.decrypt', () => {
    const pass = '20acTjPsC8vl9sSV1p8OMJrtEP85HK8B1MLIyiQdmRs='
    const cipher = "U2FsdGVkX18wk967sMVeGqhyPYZYDvMnr0HXKWd6VBbpunae+T5KGQdwFaTM8EL070ZKz2maesBjXYvJ6/LW7Q=="

    const decrypted = CryptoJS.AES.decrypt(cipher, pass)
    const compatDecrypted = compatCryptoJS.AES.decrypt(cipher, pass)

    expect(compatDecrypted).toEqual(WordArray2Buffer(decrypted))
  })
})

function WordArray2Buffer(wa: any): Buffer {
  // WordArray is typed array implementation in crypto-js that uses a simple
  // array of ints as backing
  //
  // Converting it like this:
  //
  // const uint8 = new Uint8Array(Uint32Array.from(wa.words).buffer, 0, wa.sigBytes)
  //
  // doesn't work because x86 is little endian, and javascript TypedArray
  // endianness is machine dependent.
  // So we have to use Buffer.writeInt32BE (Big Endian)

  const buf = Buffer.alloc(wa.words.length * 4)
  for (let i = 0; i < wa.words.length; i++) {
    buf.writeInt32BE(wa.words[i], i * 4)
  }
  return buf.slice(0, wa.sigBytes)
}

function walletEncrypt(data: string, pass: string) {
  const encrypted = CryptoJS.AES.encrypt(data, pass)
  return encrypted.toString()
}

// Helpers just to make clear which vars are Buffers and which are WordArrays
const WordArray2Hex = (wa: any) => wa && wa.toString()
const Buffer2Hex = (buf: Buffer | undefined) => buf && buf.toString('hex')
