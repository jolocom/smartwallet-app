import SHA256 from 'crypto-js/sha256'

import Keypair from 'keypair'
import bitcore from 'bitcore-lib'
import ECIES from 'bitcore-ecies'
var EC = require('elliptic').ec

// import {EC} from 'elliptic'
let ec = new EC('secp256k1')

export default class WalletCrypto {
  sha256(message) {
    return SHA256(message)
  }

  generatePrivateRSAKey() {
    let pair = new Keypair({bits: 1024})
    let privateKey = pair.private.substring(32)
    privateKey = privateKey.substring(0, privateKey.length - 31)
    return privateKey
  }
  computeCompressedEthereumPublicKey(privKey) {
    let keyPair = ec.genKeyPair()
    keyPair._importPrivate(privKey, 'hex')
    var compact = true
    var pubKey = keyPair.getPublic(compact, 'hex')
    return pubKey
  }
  encryptMessage(publicKey, message) {
    // dummy privateKey needed to init ECIES
    let privKey = new bitcore.PrivateKey(
      '91e9ed756fbad763a24d3263d86d47881d5cae53c7bd27deb7de6c1793821038'
    )
    let ecies = ECIES()
      .privateKey(privKey)
      .publicKey(new bitcore.PublicKey(publicKey))
    let encrypted = ecies.encrypt(message)
    return encrypted.toString('hex')
  }
  decryptMessage(privateKey, encrypted) {
    let privKey = new bitcore.PrivateKey(privateKey)
    let ecies = ECIES().privateKey(privKey)
    let decryptBuffer = new Buffer(encrypted, 'hex')
    let decrypted = ecies.decrypt(decryptBuffer)
    return decrypted.toString('ascii')
  }
}
