/* @summary - Generates a keypair based on provided entropy
 *
 * @param {Mnemonic} seed - a Bitcore-Mnemonic generated from hashed entropy.
 * @returns {HDPrivateKey} - an HDPrivateKey instance containing a keypair.
*/

export function deriveMasterKeyPair(seed) {
  return seed.toHDPrivateKey()
}

export function derivePrivateChildKeyPair(masterPrivateKeyPair, path) {
  return masterPrivateKeyPair.derive(path)
}

/* @summary - Generate a generic signing key according to TODO
 *
 * @param {HDPrivateKey} masterPrivateKeyPair - the master keypair used to
 * derive the child key.
 *
 * @returns {HDPrivateKey} - the derived generic signing key.
 *
*/

export function deriveGenericSigningKeyPair(masterPrivateKeyPair) {
  return derivePrivateChildKeyPair(masterPrivateKeyPair, 'm/73\'/0\'/0\'')
}

/* @summary - Generate an Ethereum keypair according to goo.gl/sr5dvy
 *
 * @param {HDPrivateKey} masterPrivateKeyPair - the master keypair used to
 * derive the child key.
 *
 * @returns {HDPrivateKey} - the derived Ethereum keypair.
 *
*/

export function deriveEthereumKeyPair(masterPrivateKeyPair) {
  return derivePrivateChildKeyPair(masterPrivateKeyPair, 'm/44\'/60\'/0\'/0/0')
}
