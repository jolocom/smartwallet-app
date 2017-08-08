// @TODO replace values by env settings using gulp
// endpoint - A String that is the http/s address of the app
// dev      - A boolean that if true allows to login app without certificate
module.exports = {
  proxy: 'https://proxy.jolocom.de',
  endpoint: 'https://localhost:8443',
  gateway: 'https://identity.jolocom.com',
  blockchain: {
    // Test RPC node
    gethHost: 'http://verification.jolocom.com:9050',
    lookupContractAddress: '0x1f18b8d96f0a26eea82ce0d4bc202cc429df955f'

    // Ropsten Testnet on 2017-04-12
    // gethHost: 'http://verification.jolocom.com:8545',
    // lookupContractAddress: '0x58ab8f7c72b4bec073db317d92aa0a15f09d9a6b'
  },
  dev: true
}
