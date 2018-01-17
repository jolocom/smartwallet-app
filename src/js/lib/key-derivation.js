import bitcoin from 'bitcoinjs-lib'
import bip39 from 'bip39'

/* @summary - Generates a keypair based on provided entropy
 *
 * @param {String} seedPhrase - a BIP39 compliant mnemonic generated from hashed entropy.
 * @returns {HDNode} - an instance containing a master keypair and a default Bitcoin network object.
*/

export function deriveMasterKeyPairFromSeedPhrase(seedPhrase) {
  const seed = bip39.mnemonicToSeed(seedPhrase)
  return bitcoin.HDNode.fromSeedBuffer(seed)
}

/* @summary - Generate a generic signing key according to BIP32 specification
 *
 * @param {HDNode} masterKeyPair - the master keypair used to
 * derive the child key.
 *
 * @returns {HDNode} - the derived child  generic signing key.
 *
*/
export function deriveGenericSigningKeyPair(masterKeyPair) {
  return masterKeyPair.derivePath('m/73\'/0\'/0\'')
}

/* @summary - Generate an Ethereum keypair according to goo.gl/sr5dvy
 *
 * @param {HDNode} masterKeyPair - the master keypair used to
 * derive the child key.
 *
 * @returns {HDNode} - the derived Ethereum keypair.
 *
*/
export function deriveEthereumKeyPair(masterKeyPair) {
  return masterKeyPair.derivePath('m/44\'/60\'/0\'/0/0')
}
