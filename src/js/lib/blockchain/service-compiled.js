'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

// WORKARROUND
// TODO: migrate to webpack 2
// https://github.com/ConsenSys/eth-lightwallet/issues/102
// start

var _ethLightwallet = require('eth-lightwallet');

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

var _hookedWeb3Provider = require('hooked-web3-provider');

var _hookedWeb3Provider2 = _interopRequireDefault(_hookedWeb3Provider);

var _bigNumber = require('big-number');

var _bigNumber2 = _interopRequireDefault(_bigNumber);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sourceCreateHash = _crypto2.default.createHash;
_crypto2.default.createHash = function createHash(alg) {
    if (alg === 'ripemd160') {
        alg = 'rmd160';
    }
    return sourceCreateHash(alg);
};
// end
//-----------------------------------------------

var web3 = null;

var BlockchainService = function () {
    function BlockchainService() {
        _classCallCheck(this, BlockchainService);

        this.gethHost = 'http://193.175.133.233:8545';
        this.globalKeystore = null;
        this.web3 = null;
        this.password = 'mpo';
        this.mainAddress = '0x';
    }

    _createClass(BlockchainService, [{
        key: 'setWeb3Provider',
        value: function setWeb3Provider(ks) {
            this.globalKeystore = ks;
            var web3Provider = new _hookedWeb3Provider2.default({
                host: this.gethHost,
                transaction_signer: this.globalKeystore
            });
            this.web3 = new _web2.default(web3Provider);
            web3 = this.web3;
        }
    }, {
        key: 'login',
        value: function login(seed, password) {
            _ethLightwallet.keystore.createVault({
                password: password,
                seedPhrase: seed
            }, function (err, ks) {

                // Some methods will require providing the `pwDerivedKey`,
                // Allowing you to only decrypt private keys on an as-needed basis.
                // You can generate that value with this convenient method:
                ks.keyFromPassword(password, function (err, pwDerivedKey) {
                    if (err) throw err;

                    // generate two new address/private key pairs
                    // the corresponding private keys are also encrypted
                    ks.generateNewAddress(pwDerivedKey, 2);
                    var addresses = ks.getAddresses();
                    console.log(addresses);

                    ks.passwordProvider = function (callback) {
                        var pw = this.password;
                        callback(null, pw);
                    };

                    // Now set ks as transaction_signer in the hooked web3 provider
                    // and you can start using web3 using the keys/addresses in ks!

                    this.setWeb3Provider(ks);
                    this._getBalances(addresses);
                    this._setMainAddress(addresses[0]);

                    //TESTS
                    this._testWriteToSmartContract();
                    this._testReadFromSmartContract();
                }.bind(this));
            }.bind(this));
        }
    }, {
        key: '_setMainAddress',
        value: function _setMainAddress(address) {
            this.mainAddress = address;
        }
    }, {
        key: 'register',
        value: function register(entropy) {

            var randomSeed = _ethLightwallet.keystore.generateRandomSeed(entropy);
            var testSeed = "mandate print cereal style toilet hole cave mom heavy fork network indoor";
            var seed = testSeed;
            // the seed is stored encrypted by a user-defined password
            var password = this.password;

            this.login(seed, password);

            return seed;
        }
    }, {
        key: '_computeCompressedPublicKeyFromPrivateKey',
        value: function _computeCompressedPublicKeyFromPrivateKey(privKey) {
            var keyPair = ec.genKeyPair();
            keyPair._importPrivate(privKey, 'hex');
            var compact = true;
            var pubKey = keyPair.getPublic(compact, 'hex');
            return pubKey;
        }
    }, {
        key: '_getBalances',


        /*
         */
        value: function _getBalances(addresses) {
            //TODO: implement async in react actions
            console.log("Balances");
            var address = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = addresses[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    address = _step.value;

                    var ether = this.web3.fromWei(this.web3.eth.getBalance("0x" + address), 'ether').toString(10);
                    console.log(address + " " + ether + " ETH");
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: '_testWriteToSmartContract',
        value: function _testWriteToSmartContract() {
            console.log("test write smart contract");
            //testsmartcontract deployed in ropsten testnet
            var testABI = [{
                constant: true,
                inputs: [{ name: "", type: "address" }],
                name: "webIDLookup",
                outputs: [{ name: "", type: "bytes" }],
                payable: false,
                type: "function"
            }, {
                constant: true,
                inputs: [{ name: "personaAddress", type: "address" }],
                name: "getAttributes",
                outputs: [{ name: "", type: "bytes" }],
                payable: false,
                type: "function"
            }, {
                constant: true,
                inputs: [],
                name: "version",
                outputs: [{ name: "", type: "uint256" }],
                payable: false,
                type: "function"
            }, {
                constant: true,
                inputs: [],
                name: "previousPublishedVersion",
                outputs: [{ name: "", type: "address" }],
                payable: false,
                type: "function"
            }, {
                constant: false,
                inputs: [{ name: "webID", type: "bytes" }],
                name: "setAttributes",
                outputs: [],
                payable: false,
                type: "function"
            }, { inputs: [], payable: false, type: "constructor" }, {
                anonymous: false,
                inputs: [{ indexed: true, name: "_sender", type: "address" }, {
                    indexed: false,
                    name: "_timestamp",
                    type: "uint256"
                }],
                name: "AttributesSet",
                type: "event"
            }];
            var testSmartContractAddress = "0x7cbea15468484786e682d27250a5980abe4a7f47";

            var attribute = "test attribute " + Date.now();
            var contract = this.web3.eth.contract(testABI).at(testSmartContractAddress);
            var functionName = "setAttributes";
            var args = [];
            args.push(attribute);
            var valueEth = 0;
            var value = parseFloat(valueEth) * 1.0e18;
            var gasPrice = 50000000000;
            var gas = 3141592;

            args.push({ from: this.mainAddress, value: value, gasPrice: gasPrice, gas: gas });
            var callback = function callback(err, txhash) {
                console.log('error: ' + err);
                console.log('txhash: ' + txhash);
            };
            args.push(callback);
            contract[functionName].apply(this, args);
        }
    }, {
        key: '_hex2a',
        value: function _hex2a(hexx) {
            var hex = hexx.toString(); //force conversion
            var str = '';
            for (var i = 0; i < hex.length; i += 2) {
                str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            }return str;
        }
    }, {
        key: '_testReadFromSmartContract',
        value: function _testReadFromSmartContract() {
            console.log("test read smart contract");

            //testsmartcontract deployed in ropsten testnet
            var testABI = [{
                constant: true,
                inputs: [{ name: "", type: "address" }],
                name: "webIDLookup",
                outputs: [{ name: "", type: "bytes" }],
                payable: false,
                type: "function"
            }, {
                constant: true,
                inputs: [{ name: "personaAddress", type: "address" }],
                name: "getAttributes",
                outputs: [{ name: "", type: "bytes" }],
                payable: false,
                type: "function"
            }, {
                constant: true,
                inputs: [],
                name: "version",
                outputs: [{ name: "", type: "uint256" }],
                payable: false,
                type: "function"
            }, {
                constant: true,
                inputs: [],
                name: "previousPublishedVersion",
                outputs: [{ name: "", type: "address" }],
                payable: false,
                type: "function"
            }, {
                constant: false,
                inputs: [{ name: "webID", type: "bytes" }],
                name: "setAttributes",
                outputs: [],
                payable: false,
                type: "function"
            }, { inputs: [], payable: false, type: "constructor" }, {
                anonymous: false,
                inputs: [{ indexed: true, name: "_sender", type: "address" }, {
                    indexed: false,
                    name: "_timestamp",
                    type: "uint256"
                }],
                name: "AttributesSet",
                type: "event"
            }];

            var testSmartContractAddress = "0x7cbea15468484786e682d27250a5980abe4a7f47";
            var contract = this.web3.eth.contract(testABI).at(testSmartContractAddress);

            var attribute = contract.getAttributes("0x" + this.mainAddress);
            attribute = attribute.substr(2); //remove 0x
            attribute = this._hex2a(attribute);
            console.log("Attribute from Ropsten Testnet");
            console.log(attribute);
        }
    }, {
        key: 'signAContract',
        value: function signAContract(code, abi, callback) {

            var txutils = lightwallet.txutils;
            var signing = lightwallet.signing;

            var nonce = 100;

            this.globalKeystore.keyFromPassword(password, function (err, pwDerivedKey) {

                var sendingAddr = this.mainAddress;

                // The transaction data follows the format of ethereumjs-tx
                var txOptions = {
                    gasPrice: 10000000000,
                    gasLimit: 3000000,
                    value: 1,
                    nonce: nonce,
                    data: code
                };

                // sendingAddr is needed to compute the contract address
                var contractData = txutils.createContractTx(sendingAddr, txOptions);
                var signedTx = signing.signTx(global_keystore, pwDerivedKey, contractData.tx, sendingAddr);

                callback(signedTx, contractData.addr);
            }.bind(this));
        }
    }]);

    return BlockchainService;
}();

var _default = BlockchainService;
exports.default = _default;
;

var _temp = function () {
    if (typeof __REACT_HOT_LOADER__ === 'undefined') {
        return;
    }

    __REACT_HOT_LOADER__.register(sourceCreateHash, 'sourceCreateHash', '/home/manuel/fraunhofer/little-sister/src/js/lib/blockchain/service.js');

    __REACT_HOT_LOADER__.register(web3, 'web3', '/home/manuel/fraunhofer/little-sister/src/js/lib/blockchain/service.js');

    __REACT_HOT_LOADER__.register(BlockchainService, 'BlockchainService', '/home/manuel/fraunhofer/little-sister/src/js/lib/blockchain/service.js');

    __REACT_HOT_LOADER__.register(_default, 'default', '/home/manuel/fraunhofer/little-sister/src/js/lib/blockchain/service.js');
}();

;

//# sourceMappingURL=service-compiled.js.map