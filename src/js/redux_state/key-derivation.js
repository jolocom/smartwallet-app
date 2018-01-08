import { Mnemonic, HDPrivateKey } from 'bitcore-lib'

/* Returns a HDPrivateKey instance (from bitcore-lib)
   which contains both public and private keys */
export function deriveMasterKeyPair(seed) {
  return seed.toHDPrivateKey()
  // possibility to pass in additional passphrase above
}

export function derivePrivateChildKeyPair(masterPrivateKeyPair, path) {
  return masterPrivateKeyPair.derive(path)
}

export function deriveGenericSigningKeyPair(masterPrivateKeyPair) {
  /* TODO: re-think second-level path naming (73 =>
  not a previously existing BIP) */
  return derivePrivateChildKeyPair(masterPrivateKeyPair, "m/73'/0'/0'")
}

export function deriveEthereumKeyPair(masterPrivateKeyPair) {
  return derivePrivateChildKeyPair(masterPrivateKeyPair, "m/44'/60'/0'/0/0")
}
