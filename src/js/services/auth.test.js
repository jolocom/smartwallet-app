import {expect} from 'chai'
import AuthService from './auth'
import {stub} from '../../../test/utils'

describe('#AuthService', () => {
  describe('General Instance Properties', () => {
    it('should set currentUser null on init', () => {
      const auth = new AuthService()
      expect(auth.currentUser).to.be.null
    })
  })
  describe('registerWithSeedPhrase', () => {
    it('should call backend register with the proper params',
    () => {
      const backend = {
        register: stub().returnsAsync({wallet: 'RegSeed'})
      }
      const registration = {
        userName: 'bigly',
        seedPhrase: 'whoop'
      }
      const auth = new AuthService(backend)
      expect(auth.register(registration)).to.eventually
        .deep.equal({
          wallet: 'RegSeed'
        })
      expect(backend.register.called).to.be.true
      expect(backend.register.calls).to.deep.equal([{
        args: [{
          userName: 'bigly',
          seedPhrase: 'whoop'
        }]
      }])
    })
  })
  // describe('registerWithCredentials', () => {
  //   it('should call backend registerWithCredentials with proper params',
  //   () => {
  //     const backend = {
  //       registerWithCredentials: stub().returnsAsync('RegPass')
  //     }
  //     const registration = {
  //       userName: 'bigly',
  //       email: 'j.j@j.c',
  //       seedPhrase: 'bla bla',
  //       password: 'canyouseeme?',
  //       pin: '1234'
  //     }
  //     const auth = new AuthService(backend)
  //     expect(auth.registerWithCredentials(registration)).to.eventually
  //       .deep.equal({
  //         wallet: 'RegPass'
  //       })
  //     expect(backend.registerWithCredentials.called).to.be.true
  //     expect(backend.registerWithCredentials.calls).to.deep.equal([{
  //       args: [{
  //         userName: 'bigly',
  //         email: 'j.j@j.c',
  //         seedPhrase: 'bla bla',
  //         password: 'canyouseeme?',
  //         pin: '1234'
  //       }]
  //     }])
  //   })
  // })
  describe('loginWithSeedPhrase', () => {
    it('should call backend login with proper params', () => {
      const backend = {
        login: stub().returnsAsync({wallet: 'LogSeed'})
      }
      const login = {
        seedPhrase: 'bigly',
        pin: '1234'
      }
      const auth = new AuthService(backend)
      expect(auth.login(login)).to.eventually
        .deep.equal({
          wallet: 'LogSeed'
        })
      expect(backend.login.called).to.be.true
      expect(backend.login.calls).to.deep.equal([{
        args: [{
          seedPhrase: 'bigly',
          pin: '1234'
        }]
      }])
    })
  })
  // describe('logiWithCredentials', () => {
  //   it('should call backend loginWithCredentials with proper params', () => {
  //     const backend = {
  //       loginWithCredentials: stub().returnsAsync('LogPass'),
  //       loginFromSerialized: stub()
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
  //     expect(backend.loginWithCredentials.called).to.be.true
  //     expect(backend.loginWithCredentials.calls).to.deep.equal([{
  //       args: [{
  //         email: 'j.j@j.c',
  //         password: 'canyouseeme?',
  //         pin: '1234'
  //       }]
  //     }])
  //   })
  // })
})
