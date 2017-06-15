// @TODO replace values by env settings using gulp
module.exports = {
  proxy: 'https://proxy.jolocom.net',
  endpoint: 'https://proxy.jolocom.net/proxy?url=https://webid.jolocom.de',
  accountStatusEndpoint:
    'https://proxy.jolocom.net/proxy?' +
    'url=https:webid.jolocom.de,system/accountStatus',
  verificationProvider: 'https://verification.jolocom.com',
  blockchain: {
    // Test RPC node
    gethHost: 'http://verification.jolocom.com:9050',
    lookupContractAddress: '0x1f18b8d96f0a26eea82ce0d4bc202cc429df955f',
    jolocomEtherAddress: 'https://verification.jolocom.com/ether',
    seedStorage: {
      url: 'https://seed-service.jolocom.net/'
    }

    // infura geth node
    // gethHost: 'https://rinkeby.infura.io',
    // lookupContractAddress: '0x1f18b8d96f0a26eea82ce0d4bc202cc429df955f',

    // local geth node
    // gethHost: 'http://localhost:8545',
    // lookupContractAddress: '0x1f18b8d96f0a26eea82ce0d4bc202cc429df955f',

    // Ropsten Testnet on 2017-04-12
    // gethHost: 'http://verification.jolocom.com:8545',
    // lookupContractAddress: '0x58ab8f7c72b4bec073db317d92aa0a15f09d9a6b',
  },
  dev: true
}
