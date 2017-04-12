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
import EthContract from 'ethjs-contract'

import SHA256 from 'crypto-js/sha256'

import IdentityContract from 'lib/blockchain/smart_contracts/identity'


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

class BlockchainService {
	constructor() {
		this.gethHost = 'http://193.175.133.233:8545'
		//testing
		//this.gethHost = 'http://localhost:8545'
		this.globalKeystore = null
		this.web3 = null
		this.password = 'mpo'
		this.mainAddress = '0x'
		this.eth = null

		//smart contract
		this.identityAddress = "0x"
		this.provider = null

	}

	setProvider(ks, privateKey, mainAddress) {
		this.globalKeystore = ks


		let provider = new SignerProvider(this.gethHost, {

			signTransaction: (rawTx, cb) => cb(null, sign(rawTx, privateKey)),

			accounts: (cb) => cb(null, [mainAddress])
		})



		this.provider = provider
		this.eth = new Eth(this.provider)
		this.web3 = new Web3(this.provider)

	}

	login(seed, password) {
		keystore.createVault({
			password: password,
			seedPhrase: seed,
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
				this.setProvider(ks, "0x" + privateKey, addresses[0])
				this._setMainAddress(addresses[0])
				this._getBalances(addresses)

				console.log("main address")
				console.log(addresses[0])

				//TESTS

				//this._createIdentityContract()

				this.identityAddress = "0xe677cea4f0318d7ec26e16ec268bfa2a150f2e0a"
				this._addAttributeToContract(this.identityAddress, "test134xx", "_fakeWebID2xx_")
				this._getAttributeFromIdentityContract(this.identityAddress, "webid")
			}.bind(this))

		}.bind(this))

	}

	_createIdentityContract() {

		//allready created contract 0x1605970Cc47370750596A24fAF143AFfA6C406E9
		console.log("create idenity contract")
		var identityContract = this.web3.eth.contract(IdentityContract.abi);
		var address = "0x" + this.mainAddress;
		console.log(address)
		//address = this.web3.eth.accounts[0]
		console.log("address -->")
		console.log(address)
		let code = "0x" + IdentityContract.abi.code
		console.log(code)



		let identity = identityContract.new({
			from: address,
			data: "0x" + IdentityContract.binary,
			gas: 3000000
		}, function (e, contract) {

			console.log("call back function")
			console.log(e)
			if (!e) {

				if (!contract.address) {
					console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");

				} else {
					console.log("Contract mined! Address: " + contract.address);
					console.log(contract);
				}

			}
		})

	}


	_createAttributeID(attributeName) {

		return "0x" + SHA256(attributeName).toString()

	}

	_getAttributeFromIdentityContract(identityContractAddress, name) {

		var id = this._createAttributeID(name)

		var contract = this.web3.eth.contract(IdentityContract.abi).at(identityContractAddress)

		var webID = contract.getAttributeValue(id, function (err, result) {

			console.log("smart contract call: getAttributeValue")
			console.log(result)


		})


	}
	_addAttributeToContractETHjs(identityContractAddress, name, value) {

		const Identity = this._generateContractFactory(IdentityContract.abi, IdentityContract.binary, 300000)
		var id = this._createAttributeID(name)
		const identity = Identity.at(identityContractAddress)
		identity.addAttributeWithValue(id, value, (error, result) => {

			console.log("attribute added to contract")
			console.log("transaction id")
			console.log(result)
			console.log(error)
		})
	}

	_addAttributeToContract(identityContractAddress, name, value) {

		let identityContract = this.web3.eth.contract(IdentityContract.abi).at(identityContractAddress);

		var id = this._createAttributeID(name)

		var functionName = "addAttributeWithValue";
		var args = [];


		args.push(value);
		args.push(id);

		var valueEth = 0;
		var value = parseFloat(valueEth) * 1.0e18;
		var gasPrice = 50000000000;
		var gas = 3141592;

		args.push({
			from: this.mainAddress,
			value: value,
			gasPrice: gasPrice,
			gas: gas
		})
		var callback = function (err, txhash) {
			console.log('error: ' + err)
			console.log('txhash: ' + txhash)
		}
		args.push(callback);
		identityContract[functionName].apply(this, args);

	}

	_setMainAddress(address) {
		this.mainAddress = address
	}

	register(entropy) {

		let randomSeed = keystore.generateRandomSeed(entropy)
		let testSeed = "mandate print cereal style toilet hole cave mom heavy fork network indoor"
		let seed = testSeed
		// the seed is stored encrypted by a user-defined password
		let password = this.password

		this.login(seed, password)

		return seed
	}


	_computeCompressedPublicKeyFromPrivateKey(privKey) {
		let keyPair = ec.genKeyPair()
		keyPair._importPrivate(privKey, 'hex')
		let compact = true
		let pubKey = keyPair.getPublic(compact, 'hex')
		return pubKey


	}
	/*
	*/
	_getBalances(addresses) {
		//TODO: implement async in react actions
		console.log("Balances")
		let address = 0
		for (address of addresses) {

			let balance = this.web3.eth.getBalance("0x" + address, (err, result) => {

				console.log(this.web3.fromWei(result, 'ether').toString(10))

			})

		}
	}

}

export default BlockchainService
