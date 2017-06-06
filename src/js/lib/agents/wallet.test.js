import {expect} from 'chai'
import WalletAgent from 'lib/agents/wallet'
import {WalletManager} from 'smartwallet-contracts'

describe('#WalletAgentClass', () => {
  describe('WalletAgent', () => {
    it('should have a Wallet Manager', () => {
      const wallet = new WalletAgent()
      expect(wallet._manager).to.be.instanceof(WalletManager)
    })
  })
  describe('generateSeedPhrase', () => {
    it('should return a string of atleast 10 words', () => {
      let entropy = ''
      const wallet = new WalletAgent()
      expect(wallet.generateSeedPhrase(entropy)
        .split(' ').length).to.be.above(10)
    })
  })
  // Integration does not work yet - uncomment when functional
  /* describe('registerWithSeedPhrase', () => {
     it('should be return a Wallet Manager', () => {
       const registration = {
        userName: 'hello',
        seedPhrase: 'mandate print cereal style toilet hole' +
          ' cave mom heavy fork network indoor',
        pin: 5543
      }
      const wallet = new WalletAgent()
      expect(wallet.registerWithSeedPhrase(registration)).to.be
        .instanceof(WalletManager)
    })
  })
  describe('loginWithSeedPhrase', () => {
    it('should call manager loginWithSeedPhrase', () => {
      const login = {
        userName: 'hello',
        seedPhrase: 'mandate print cereal style toilet hole' +
          ' cave mom heavy fork network indoor'
      }
      const wallet = new WalletAgent()
      expect(wallet.loginWithSeedPhrase(login)).to.eventually.be
        .instanceof(WalletManager)
    })
  })
  */
  describe('registerWithCredentials', () => {
    it('should return a smart wallet', () => {
      const registration = {
        userName: 'To the left',
        email: 'g.g@g.c',
        password: 'canyouseeme?',
        pin: '1122'
      }
      const wallet = new WalletAgent()
      expect(wallet.registerWithCredentials(registration)).to.eventually
        .be.instanceof(WalletManager)
    })
  })
  describe('loginWithCredentials', () => {
    it('should return an instance of Wallet Manager', () => {
      const login = {
        userName: 'hello',
        email: 'g.g@g.c',
        password: 'canyouseeme?',
        pin: '1122'
      }
      const wallet = new WalletAgent()
      expect(wallet.loginWithCredentials(login)).to.eventually.be
        .instanceof(WalletManager)
    })
  })
})
