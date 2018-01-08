import Mnemonic from 'bitcore-mnemonic'

export function deriveMasterKeyPair(seed) {
  const masterKeyPair = seed.toHDPrivateKey()
  // possibility to pass in additional passphrase above
  // masterkeypair can then be stored
  return masterKeyPair
}