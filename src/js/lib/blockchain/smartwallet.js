import {keystore} from 'eth-lightwallet'
import Web3 from 'web3'

import SignerProvider from 'ethjs-provider-signer'
import {sign} from 'ethjs-signer'

import IdentityContract from 'lib/blockchain/contracts/Identity.json'
import IdentityContractLookup
  from 'lib/blockchain/contracts/IdentityLookup.json'

import CONFIG from 'lib/blockchain/config'
import WalletCrypto from 'lib/blockchain/wallet-crypto'

// -----------------------------------------------------------------------------
// WORKARROUND
// TODO: migrate to webpack 2 to remove workarround
// https://github.com/ConsenSys/eth-lightwallet/issues/102
// start
import crypto from 'crypto'
const sourceCreateHash = crypto.createHash
crypto.createHash = function createHash(alg) {
  if (alg === 'ripemd160') {
    alg = 'rmd160'
  }
  return sourceCreateHash(alg)
}
// end
// ----------------------------------------------------------------------------

export default class SmartWallet {
  constructor() {
    this.gethHost = CONFIG.GETH_HOST
    this.lookupContractAddress = CONFIG.LOOKUP_CONTRACT_ADDRESS

    this.web3 = null
    this.password = ''

    // KEYS
    this.globalKeystore = null
    this.webIDPrivateKey = undefined
    this.encryptionKeys = {}

    // ADDRESSES
    this.identityAddress = '0x'
    this.mainAddress = '0x'

    // SMART CONTRACTS
    this.identityContract = undefined
    this.lookupContract = undefined

    this.walletCrypto = new WalletCrypto()
    this.provider = null
    this.filter = null
  }

  createInstanceLookupContract(address) {
    this.lookupContract = this.web3.eth
      .contract(IdentityContractLookup.abi)
      .at(address)
  }
  createInstanceIdentityContract(address) {
    this.identityContract = this.web3.eth
      .contract(IdentityContract.abi)
      .at(address)
  }

  setWebIDPrivateKey(webIDprivateKey) {
    this.webIDPrivateKey = webIDprivateKey
  }
  getWebIDPrivateKey() {
    return this.webIDPrivateKey
  }

  addAttributeHashToIdentity(
    attributeId,
    attribute,
    definitionUrl,
    password,
    identityAddress
  ) {
    let attributeHash = '0x' + this.walletCrypto.sha256(attribute)
    let idHash = this._createAttributeID(attributeId)

    let identityContract = this.web3.eth
      .contract(IdentityContract.abi)
      .at(identityAddress)

    console.log('IdentityAddress: ' + identityAddress)

    console.log('SmartWallet: AttributeHash->' + attributeHash)
    return new Promise((resolve, reject) => {
      this.globalKeystore.keyFromPassword(
        password,
        function(err, pwDerivedKey) {
          if (err) throw err
          // TODO: only interaction possible with correct password

          let methodName = 'addAttribute'
          let args = []

          args.push(idHash)
          args.push(attributeHash)
          args.push(definitionUrl)
          this._contractMethodTransaction(
            identityContract,
            methodName,
            args,
            function(err, txhash) {
              if (!err) {
                resolve(txhash)
              } else {
                console.log(err)
              }
            }
          )
        }.bind(this)
      )
    })
  }

  getAttributeHash(attributeId, identityAddress) {
    let identityContract = this.web3.eth
      .contract(IdentityContract.abi)
      .at(identityAddress)

    let idHash = this._createAttributeID(attributeId)
    return new Promise((resolve, reject) => {
      identityContract.getAttributeHash(idHash, function(err, result) {
        if (err) {
          throw err
        }
        console.log('SmartWallet: getProperty Call')
        resolve(result)
      })
    })
  }

  createDigitalIdentity(userName, password) {
    return new Promise((resolve, reject) => {
      this.globalKeystore.keyFromPassword(
        password,
        function(err, pwDerivedKey) {
          if (err) throw err

          this._createIdentityContract().then(identityAddress => {
            console.log('SmartWallet: Identity Contract created succesfull')
            resolve(identityAddress)
          })
        }.bind(this)
      )
    })
  }

  getIdentityAddressFromLookupContract() {
    return new Promise((resolve, reject) => {
      this.lookupContract.getIdentityAddress(
        '0x' + this.mainAddress,
        function(err, result) {
          if (err) {
            throw err
          }
          console.log('SmartWallet: getIdentityAddress Call')
          resolve(result)
        }
      )
    })
  }

  getEncryptionKeys() {
    return this.encryptionKeys
  }
  setIdentityAddress(identityAddress) {
    this.identityAddress = identityAddress
    // create instance of the identity smart contract
    this.createInstanceIdentityContract(this.identityAddress)
  }
  getIdentityAddress() {
    return this.identityAddress
  }
  generatePrivateKeyForWebID() {
    return this.walletCrypto.generatePrivateRSAKey()
  }
  init(seedPhrase, password) {
    console.log('SmartWallet: create LightWallet')
    console.log('SmartWallet: seedPhrase -> ' + seedPhrase)

    return new Promise((resolve, reject) => {
      keystore.createVault(
        {
          password: password,
          seedPhrase: seedPhrase
        },
        function(err, ks) {
          if (err) {
            throw err
          }
          ks.keyFromPassword(
            password,
            function(err, pwDerivedKey) {
              if (err) throw err

              ks.generateNewAddress(pwDerivedKey, 2)
              let addresses = ks.getAddresses()

              /* ks.passwordProvider = function(callback) {
                let pw = this.password
                callback(null, pw)
              }*/

              this._setMainAddress(addresses[0])
              let privateKey = ks.exportPrivateKey(
                this.mainAddress,
                pwDerivedKey
              )

              console.log('SmartWallet: private key -> ' + privateKey)

              // get encryption keys -> second addresses
              let privateKeySecondAddress = ks.exportPrivateKey(
                addresses[1],
                pwDerivedKey
              )
              let publicKeySecondAddress = this.walletCrypto
              .computeCompressedEthereumPublicKey(
                privateKeySecondAddress
              )
              this.encryptionKeys = {
                privateKey: privateKeySecondAddress,
                publicKey: publicKeySecondAddress
              }

              this._setProvider(ks, '0x' + privateKey, this.mainAddress)
              console.log('SmartWallet: main addresses ' + this.mainAddress)
              this._getBalances(addresses)

              // create lookup contract instance
              this.createInstanceLookupContract(this.lookupContractAddress)

              resolve(this.mainAddress)
            }.bind(this)
          )
        }.bind(this)
      )
    })
  }
  getProperty(propertyId) {
    let id = this._createAttributeID(propertyId)

    return new Promise((resolve, reject) => {
      this.identityContract.getProperty(id, function(err, result) {
        if (err) {
          throw err
        }
        console.log('SmartWallet: getProperty Call')
        resolve(result)
      })
    })
  }

  addProperty(id, value, password) {
    console.log(
      'SmartWallet start to add a property to identity contract ' +
        this.identityAddress
    )
    return new Promise((resolve, reject) => {
      this.globalKeystore.keyFromPassword(
        password,
        function(err, pwDerivedKey) {
          if (err) throw err
          // TODO: only interaction possible with correct password

          let methodName = 'addProperty'
          let args = []

          args.push(this._createAttributeID(id))
          args.push(value)
          this._contractMethodTransaction(
            this.identityContract,
            methodName,
            args,
            function(err, txhash) {
              if (!err) {
                resolve(txhash)
              }
            }
          )
        }.bind(this)
      )
    })
  }

  encryptPrivateKeyForWebID(privateKeyWebID) {
    return this.walletCrypto.encryptMessage(
      this.encryptionKeys.publicKey,
      privateKeyWebID
    )
  }
  decryptPrivateKeyForWebID(privateKeyWebIDEncrypted) {
    return this.walletCrypto.decryptMessage(
      this.encryptionKeys.privateKey,
      privateKeyWebIDEncrypted
    )
  }

  addIdentityAddressToLookupContract(_identityAddress) {
    console.log(
      'SmartWallet: add identity address to Lookup Contract -> ' +
        this.lookupContractAddress
    )

    let methodName = 'addIdentityAddress'
    let args = []

    args.push(_identityAddress)
    return new Promise((resolve, reject) => {
      this._contractMethodTransaction(
        this.lookupContract,
        methodName,
        args,
        function(err, txhash) {
          if (!err) {
            resolve({
              txhash: txhash,
              lookupContractAddress: this.lookupContractAddress
            })
          }
        }.bind(this)
      )
    })
  }

  waitingToBeMinedaAddProperty(contractAddress, transactionHash) {
    return this._waitingToBeMined(this.identityContract, transactionHash)
  }

  waitingToBeMinedaAddToLookup(contractAddress, transactionHash) {
    return this._waitingToBeMined(this.lookupContract, transactionHash)
  }

  _setProvider(ks, privateKey, mainAddress) {
    this.globalKeystore = ks

    let provider = new SignerProvider(this.gethHost, {
      // TODO: needs to be changed privatekey should only be accessable together
      //      with password
      signTransaction: (rawTx, cb) => cb(null, sign(rawTx, privateKey)),

      accounts: cb => cb(null, [mainAddress])
    })

    this.provider = provider
    this.web3 = new Web3(this.provider)
  }
  _getBalances(addresses) {
    let address = 0
    for (address of addresses) {
      this.web3.eth.getBalance('0x' + address, (err, result) => {
        if (err) {
          throw err
        }
        console.log(
          'SmartWallet: Balance Address:' +
            address +
            ' ' +
            this.web3.fromWei(result, 'ether').toString(10) +
            ' ETH'
        )
      })
    }
  }

  _setMainAddress(address) {
    this.mainAddress = address
  }

  _calculateEstimatedGas(_data, callback) {
    this.web3.eth.estimateGas(
      {
        data: _data
      },
      function(err, estimatedGas) {
        callback(err, estimatedGas)
      }
    )
  }

  _createIdentityContract() {
    return new Promise((resolve, reject) => {
      console.log('SmartWallet: start creating identity contract')
      var identityContract = this.web3.eth.contract(IdentityContract.abi)
      var address = '0x' + this.mainAddress
      this._calculateEstimatedGas(
        IdentityContract.unlinked_binary,
        function(_err, _estimatedGas) {
          console.log(
            'SmartWallet: estimated gas for Idenitiy contract deployment ' +
              _estimatedGas
          )
          identityContract.new(
            {
              from: address,
              data: IdentityContract.unlinked_binary,
              // gas: _estimatedGas + 10000
              gas: 3141592 // maximum gas
            },
            function(e, contract) {
              if (!e) {
                if (!contract.address) {
                  console.log(
                    'SmartWallet: Contract transaction send: TransactionHash:' +
                      contract.transactionHash +
                      ' waiting to be mined...'
                  )
                } else {
                  console.log('SmartWallet: Identity Contract created')
                  console.log(
                    'SmartWallet: Contract mined! Address: ' + contract.address
                  )
                  resolve(contract.address)
                }
              }
            }
          )
        }
      )
    })
  }

  _waitingToBeMined(contract, transactionHash) {
    return new Promise((resolve, reject) => {
      let myEvent = contract.EventNotification()
      myEvent.watch((error, result) => {
        if (error) {
          throw error
        }
        if (result.transactionHash === transactionHash) {
          myEvent.stopWatching()
          console.log('SmartWallet: Transaction mined!')
          resolve(result)
        }
      })
    })
  }

  _contractMethodTransaction(_contract, _methodName, _args, _callback) {
    // status: not fnished

    let gasPrice = 50000000000
    let gas = 3141592 // gas maximum

    _args.push({
      from: this.mainAddress,
      value: 0,
      gasPrice: gasPrice,
      gas: gas
    })
    _args.push(_callback)
    _contract[_methodName].apply(this, _args)
  }

  _createAttributeID(attributeName) {
    return '0x' + this.walletCrypto.sha256(attributeName).toString()
  }
}
