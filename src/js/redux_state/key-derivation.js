import { Mnemonic, HDPrivateKey } from 'bitcore-lib'

/* Returns a HDPrivateKey instance (from bitcore-lib)
   which contains both public and private keys */
export function deriveMasterKeyPair(seed) {
  const masterKeyPair = seed.toHDPrivateKey()
  // possibility to pass in additional passphrase above
  // masterkeypair can then be stored
  return masterKeyPair
}

export function deriveGenericSigningKeys(masterPrivateKey) {
  const genericSigningKey = masterPrivateKey.derive("m/identity'/0'/0'")
  return genericSigningKey
}
