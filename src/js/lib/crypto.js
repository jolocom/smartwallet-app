import wallet from 'ethereumjs-wallet'
import wif from 'wif'

// @summary - Decodes WIF encoded key and returns the key and address
// @param {String} wif - WIF encoded key
// @returns {object} - the private key and corresponding address

export function decodeWIF(wifEncodedKey) {
  const key = wif.decode(wifEncodedKey).privateKey
  const w = wallet.fromPrivateKey(key)

  return {
    privateKey: key.toString('hex'),
    address: `0x${w.getAddress().toString('hex')}`
  }
}
