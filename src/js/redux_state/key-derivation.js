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
  /* TODO: re-think second-level path naming (73 =>
  not a previously existing BIP) */
  const genericSigningKey = masterPrivateKey.derive("m/73'/0'/0'")
  return genericSigningKey
}
