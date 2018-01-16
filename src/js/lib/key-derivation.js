import bitcoin from 'bitcoinjs-lib'
import bip39 from 'bip39'

/* @summary - Generates a keypair based on provided entropy
 *
 * @param {Mnemonic} seed - a Bitcore-Mnemonic generated from hashed entropy.
 * @returns {HDPrivateKey} - an HDPrivateKey instance containing a keypair.
*/

export function deriveMasterKeyPair(seedphrase) {
  const seed = bip39.mnemonicToSeed(seedphrase)
  return bitcoin.HDNode.fromSeedBuffer(seed)
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
  return masterPrivateKeyPair.derivePath('m/73\'/0\'/0\'')
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
  return masterPrivateKeyPair.derivePath('m/44\'/60\'/0\'/0/0')
}
