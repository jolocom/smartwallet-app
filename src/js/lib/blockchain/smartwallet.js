import {keystore, txutils, signing} from 'eth-lightwallet'
import Web3 from 'web3'
import BigNumber from 'big-number'

import SignerProvider from 'ethjs-provider-signer'
import {sign} from 'ethjs-signer'
// import Eth from 'ethjs-query'
import SHA256 from 'crypto-js/sha256'

import IdentityContract from 'lib/blockchain/contracts/Identity.json'
import IdentityContractLookup
  from 'lib/blockchain/contracts/IdentityLookup.json'

// WORKARROUND
// TODO: migrate to webpack 2
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
// -----------------------------------------------

export default class SmartWallet {
  constructor() {
    this.gethHost = 'http://193.175.133.233:8545'
    // testing
    // this.gethHost = 'http://localhost:8545'
    this.globalKeystore = null
    this.web3 = null
    this.password = ''
    this.mainAddress = '0x'

    /*
		Note: Lookup Contract has been deployed on the Ropsten Testnet on 2017-04-12
		*/
    this.lookupContractAddress = '0x58ab8f7c72b4bec073db317d92aa0a15f09d9a6b'

    // smart contract
    this.identityAddress = '0x'
    this.provider = null
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

  setIdentityAddress(identityAddress) {
    this.identityAddress = identityAddress
  }
  getIdentityAddress() {
    return this.identityAddress
  }
  init(seedPhrase, password) {
    console.log('SmartWallet: create LightWallet')
    console.log('SmartWallet: seedPhrase -> ' + seedPhrase)
    console.log(password)

    return new Promise((resolve, reject) => {
      keystore.createVault(
        {
          password: password,
          seedPhrase: seedPhrase
          // seedPhrase: seedPhrase, // Optionally provide a 12-word seed phrase
          // salt: fixture.salt,     // Optionally provide a salt.
          // A unique salt will be generated otherwise.
          // hdPathString: hdPath    // Optional custom HD Path String
        },
        function(err, ks) {
          // Some methods will require providing the `pwDerivedKey`,
          // Allowing you to only decrypt private keys on an as-needed basis.
          // You can generate that value with this convenient method:

          console.log(password)
          ks.keyFromPassword(
            password,
            function(err, pwDerivedKey) {
              if (err) throw err

              // generate two new address/private key pairs
              // the corresponding private keys are also encrypted
              ks.generateNewAddress(pwDerivedKey, 2)
              let addresses = ks.getAddresses()

              ks.passwordProvider = function(callback) {
                let pw = this.password
                callback(null, pw)
              }

              this._setMainAddress(addresses[0])
              let privateKey = ks.exportPrivateKey(
                this.mainAddress,
                pwDerivedKey
              )
              this._setProvider(ks, '0x' + privateKey, this.mainAddress)
              console.log('SmartWallet: main addresses ' + this.mainAddress)
              this._getBalances(addresses)

              resolve(this.mainAddress)
              // this.identityAddress = '0xe9372945a8acbb44388f068ea78ba0ab97d497ea'
            }.bind(this)
          )
        }.bind(this)
      )
    })
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
      let balance = this.web3.eth.getBalance('0x' + address, (err, result) => {
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
    /*
		already deployed idenities
		0x864e0b01b7f29ad050fae057feee18f93f3d8aa7
		0x1931685315fc3ef7b03955bc655e76c8d8199a63
		0xe9372945a8acbb44388f068ea78ba0ab97d497ea
		---
		0x1605970Cc47370750596A24fAF143AFfA6C406E9
		*/

    // only for testing
    // using a already deployed identity contract

    /* return new Promise((resolve, reject) => {
      setTimeout(
        () => {
          resolve('0xe9372945a8acbb44388f068ea78ba0ab97d497ea')
        },
        2000
      )
    })*/
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
          let identity = identityContract.new(
            {
              from: address,
              data: IdentityContract.unlinked_binary,
              gas: _estimatedGas
            },
            function(e, contract) {
              if (!e) {
                if (!contract.address) {
                  console.log(
                    'SmartWallet: Contract transaction send: TransactionHash: ' +
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

  getProperty(propertyId) {
    console.log('get propertyId')
    console.log(this.identityAddress)
    let id = this._createAttributeID(propertyId)

    let contract = this.web3.eth
      .contract(IdentityContract.abi)
      .at(this.identityAddress)

    return new Promise((resolve, reject) => {
      contract.getProperty(id, function(err, result) {
        console.log('SmartWallet: getProperty call')
        console.log(result)
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

          let identityContract = this.web3.eth
            .contract(IdentityContract.abi)
            .at(this.identityAddress)

          // let id = this._createAttributeID(name)

          let methodName = 'addProperty'
          let args = []

          args.push(this._createAttributeID(id))
          args.push(value)
          this._contractMethodTransaction(
            identityContract,
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
  waitingForTransactionToBeMined(contractAddress, transactionHash) {
    let filter = web3.eth.filter({
      fromBlock: 'latest',
      toBlock: 'latest',
      address: contractAddress
    })
    return new Promise((resolve, reject) => {
      filter.watch(function(error, result) {
        // console.log(result)
        if (
          result.transactionHash == result.transactionHash &&
          result.type == 'mined'
        ) {
          console.log('SmartWallet: Transaction mined!')
          resolve(result.transactionHash)
          filter.stopWatching()
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
    return '0x' + SHA256(attributeName).toString()
  }

  addIdentityAddressToLookupContract(_identityAddress) {
    console.log(
      'SmartWallet: add identity address to Lookup Contract -> ' +
        this.lookupContractAddress
    )
    let identityContractLookup = this.web3.eth
      .contract(IdentityContractLookup.abi)
      .at(this.lookupContractAddress)

    // let id = this._createAttributeID(name)

    let methodName = 'addIdentityAddress'
    let args = []

    args.push(_identityAddress)
    return new Promise((resolve, reject) => {
      this._contractMethodTransaction(
        identityContractLookup,
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
}
