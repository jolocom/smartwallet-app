import {expect} from 'chai'
import AuthService from './auth'
// import {Wallet} from '../lib/agents/wallet'
// import {stub} from '../../../test/utils'

describe('#AuthService', () => {
  describe('General Instance Properties', () => {
    it('should set currentUser null on init', () => {
      const auth = new AuthService()
      expect(auth.currentUser).to.be.null
    })
  })
  describe('registerWithSeedPhrase', () => {
    // it('should call backend registerWithSeedPhrase with the proper params',
    // () => {
    //   const backend = {
    //     wallet: {
    //       registerWithSeedPhrase: stub().returnsAsync('RegSeed')
    //     }
    //   }
    //   const registration = {
    //     userName: 'bigly',
    //     seedPhrase: 'whoop',
    //     pin: '1234'
    //   }
    //   const auth = new AuthService(backend)
    //   expect(auth.registerWithSeedPhrase(registration)).to.eventually
    //     .deep.equal({
    //       wallet: 'RegSeed'
    //     })
    //   expect(backend.wallet.registerWithSeedPhrase.called).to.be.true
    //   expect(backend.wallet.registerWithSeedPhrase.calls).to.deep.equal([{
    //     args: [{
    //       userName: 'bigly',
    //       seedPhrase: 'whoop',
    //       pin: '1234'
    //     }]
    //   }])
    // })
  })
  describe('registerWithCredentials', () => {
    // it('should call backend registerWithCredentials with proper params',
    //  () => {
    //   const backend = {
    //     wallet: {registerWithCredentials: stub().returnsAsync('RegPass')}
    //   }
    //   const registration = {
    //     userName: 'bigly',
    //     email: 'j.j@j.c',
    //     password: 'canyouseeme?',
    //     pin: '1234'
    //   }
    //   const auth = new AuthService(backend)
    //   expect(auth.registerWithCredentials(registration)).to.eventually
    //     .deep.equal({
    //       wallet: 'RegPass'
    //     })
    //   expect(backend.wallet.registerWithCredentials.called).to.be.true
    //   expect(backend.wallet.registerWithCredentials.calls).to.deep.equal([{
    //     args: [{
    //       userName: 'bigly',
    //       email: 'j.j@j.c',
    //       password: 'canyouseeme?',
    //       pin: '1234'
    //     }]
    //   }])
    // })
  })
  describe('loginWithSeedPhrase', () => {
  //   it('should call backend loginWithSeedPhrase with proper params', () => {
  //     const backend = {
  //       wallet: {loginWithSeedPhrase: stub().returnsAsync('LogSeed')}
  //     }
  //     const login = {
  //       seedPhrase: 'bigly',
  //       pin: '1234'
  //     }
  //     const auth = new AuthService(backend)
  //     expect(auth.loginWithSeedPhrase(login)).to.eventually
  //       .deep.equal({
  //         wallet: 'LogSeed'
  //       })
  //     expect(backend.wallet.loginWithSeedPhrase.called).to.be.true
  //     expect(backend.wallet.loginWithSeedPhrase.calls).to.deep.equal([{
  //       args: [{
  //         seedPhrase: 'bigly',
  //         pin: '1234'
  //       }]
  //     }])
  //   })
  // })
  // describe('loginWithCredentials', () => {
  //   it('should call backend loginWithCredentials with proper params', () => {
  //     const backend = {
  //       wallet: {loginWithCredentials: stub().returnsAsync('LogPass')}
  //     }
  //     const login = {
  //       email: 'j.j@j.c',
  //       password: 'canyouseeme?',
  //       pin: '1234'
  //     }
  //     const auth = new AuthService(backend)
  //     expect(auth.loginWithCredentials(login)).to.eventually
  //       .deep.equal({
  //         wallet: 'LogPass'
  //       })
  //     expect(backend.wallet.loginWithCredentials.called).to.be.true
  //     expect(backend.wallet.loginWithCredentials.calls).to.deep.equal([{
  //       args: [{
  //         email: 'j.j@j.c',
  //         password: 'canyouseeme?',
  //         pin: '1234'
  //       }]
  //     }])
  //   })
  })
})
