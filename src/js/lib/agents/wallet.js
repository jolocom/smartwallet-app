import {
	keystore,
	txutils,
	signing
} from 'eth-lightwallet'
import Web3 from 'web3'
import BigNumber from 'big-number'

import SignerProvider from 'ethjs-provider-signer'
import {
	sign
} from 'ethjs-signer'
import Eth from 'ethjs-query'
import SHA256 from 'crypto-js/sha256'

import IdentityContract from 'lib/blockchain/contracts/Identity.json';
import IdentityContractLookup from 'lib/blockchain/contracts/IdentityContractLookup.json';

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
//-----------------------------------------------

export default class WalletAgent {

	constructor() {
		this.gethHost = 'http://193.175.133.233:8545'
		//testing
		//this.gethHost = 'http://localhost:8545'
		this.globalKeystore = null
		this.web3 = null
		this.password = 'test123'
		this.mainAddress = '0x'

		/*
		Note: Lookup Contract has been deployed on the Ropsten Testnet on 2017-04-12
		*/
		this.lookupContractAddress = "0x58ab8f7c72b4bec073db317d92aa0a15f09d9a6b"

		//smart contract
		this.identityAddress = "0x"
		this.provider = null

	}

	generateSeedPhrase(entropy) {
		let seed = keystore.generateRandomSeed(entropy)
		let testSeed = "mandate print cereal style toilet hole cave mom heavy fork network indoor"
		//only for testing testSeed has some ether on ropsten testnet
		seed = testSeed
		console.log("entropy----->")
		console.log(entropy)
		console.log(IdentityContract)
		return seed;
	}

	getSeedPhrase(email, password) {
		return 'blabla blabla blabla blabla blabla blabla blabla blabla'
	}

	_setProvider(ks, privateKey, mainAddress) {
		this.globalKeystore = ks

		let provider = new SignerProvider(this.gethHost, {

			signTransaction: (rawTx, cb) => cb(null, sign(rawTx, privateKey)),

			accounts: (cb) => cb(null, [mainAddress])
		})

		this.provider = provider
		this.web3 = new Web3(this.provider)

	}


	registerWithSeedPhrase({
		userName,
		seedPhrase
	}) {

		let password = "1234";

		console.log("registerWithSeedPhrase")
		console.log("username")
		console.log(userName)
		console.log("seedPhrase")
		console.log(seedPhrase)

		keystore.createVault({
			password: password,
			seedPhrase: seedPhrase,
			// seedPhrase: seedPhrase, // Optionally provide a 12-word seed phrase
			// salt: fixture.salt,     // Optionally provide a salt.
			// A unique salt will be generated otherwise.
			// hdPathString: hdPath    // Optional custom HD Path String
		}, function (err, ks) {

			// Some methods will require providing the `pwDerivedKey`,
			// Allowing you to only decrypt private keys on an as-needed basis.
			// You can generate that value with this convenient method:
			ks.keyFromPassword(password, function (err, pwDerivedKey) {
				if (err) throw err

				// generate two new address/private key pairs
				// the corresponding private keys are also encrypted
				ks.generateNewAddress(pwDerivedKey, 2)
				let addresses = ks.getAddresses()
				console.log(addresses)

				ks.passwordProvider = function (callback) {
					let pw = this.password
					callback(null, pw)
				}

				// Now set ks as transaction_signer in the hooked web3 provider
				// and you can start using web3 using the keys/addresses in ks!

				let privateKey = ks.exportPrivateKey(addresses[0], pwDerivedKey)
				console.log("private key")
				console.log(privateKey)
				this._setProvider(ks, "0x" + privateKey, addresses[0])
				this._setMainAddress(addresses[0])
				this._getBalances(addresses)

				console.log("main address")
				console.log(addresses[0])

				//TESTS

				this._createIdentityContract()

			}.bind(this))

		}.bind(this))




		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(new Wallet())
			}, 2000)
		})
	}

	_getBalances(addresses) {
		console.log("Balances")
		let address = 0
		for (address of addresses) {

			let balance = this.web3.eth.getBalance("0x" + address, (err, result) => {

				console.log(this.web3.fromWei(result, 'ether').toString(10))

			})

		}
	}

	_setMainAddress(address) {
		this.mainAddress = address
	}

	_calculateEstimatedGas(_data, callback) {
		this.web3.eth.estimateGas({
			data: _data
		}, function (err, estimatedGas) {
			callback(err, estimatedGas)
		})
	}

	_createIdentityContract() {

		/*
		already deployed idenities
		0x864e0b01b7f29ad050fae057feee18f93f3d8aa7
		---
		0x1605970Cc47370750596A24fAF143AFfA6C406E9
		*/
		console.log("create idenity contract")
		var identityContract = this.web3.eth.contract(IdentityContract.abi);
		var address = "0x" + this.mainAddress;
		console.log(address)
		//address = this.web3.eth.accounts[0]
		console.log("address -->")
		console.log(address)

		this._calculateEstimatedGas(IdentityContract.unlinked_binary, function (_err, _estimatedGas) {
			console.log("estimated gas for contract deployment")
			console.log(_estimatedGas)
			let identity = identityContract.new({
				from: address,
				data: IdentityContract.unlinked_binary,
				gas: _estimatedGas
			}, function (e, contract) {

				console.log("call back function")
				console.log(e)
				if (!e) {

					if (!contract.address) {
						console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...")

					} else {
						console.log("Identity Contract created")
						console.log("Contract mined! Address: " + contract.address)
						console.log(contract)
					}

				}
			})

		})

	}

	_contractMethodTransaction(_contract, _methodName, _args, _callback) {
		//status: not fnished
		let valueEth = 0
		let value = parseFloat(valueEth) * 1.0e18
		let gasPrice = 50000000000
		let gas = 3141592

		_args.push({
			from: this.mainAddress,
			value: value,
			gasPrice: gasPrice,
			gas: gas
		})
		let callback = function (err, txhash) {
			console.log('error: ' + err)
			console.log('txhash: ' + txhash)
		}
		_args.push(_callback);
		_contract[_methodName].apply(this, args)

	}

	_addIdentityAddressToLookupContract(_identityLookupAddress, _identityAddress, _callback) {
		//status: not fnished
		let identityContractLookup = this.web3.eth.contract(IdentityContractLookup.abi).at(identityLookupAddress)

		let id = this._createAttributeID(name)

		let methodName = "addIdentityAddress"
		let args = [];

		args.push(_identityAddress);

		this._contractMethodTransaction(identityContractLookup, methodName, args, _callback)
	}



	registerWithCredentials({
		userName,
		email,
		password
	}) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(new Wallet())
			}, 2000)
		})
	}

	loginWithSeedPhrase({
		userName,
		seedPhrase
	}) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(new Wallet())
			}, 2000)
		})
	}

	loginWithCredentials({
		userName,
		email,
		password
	}) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(new Wallet())
			}, 2000)
		})
	}
}

export class Wallet {
	constructor(_web3, _keystore, _addressIdentityContract) {
		this.addressIdentityContract = _addressIdentityContract
		this.keystore = _keystore
		this.web3 = _web3
		this.webID = 'https://demo.webid.jolocom.com/profile/card'
		this.lightWaller = 'something'
	}

}
