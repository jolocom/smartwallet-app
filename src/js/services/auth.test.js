import {expect} from 'chai'
import AuthService from './auth'
import {Wallet} from '../lib/agents/wallet'
import {stub} from '../../../test/utils'

describe('#AuthService', () => {
  describe('General Instance Properties', () => {
    it('should set currentUser.wallet to a Wallet Instance', () => {
      const auth = new AuthService()
      expect(auth.currentUser.wallet).to.be.instanceof(Wallet)
    })
  })
  describe('registerWithSeedPhrase', () => {
    it('should call backend registerWithSeedPhrase with the proper params',
    () => {
      const backend = {
        registerWithSeedPhrase: stub().returnsAsync('RegSeed')
      }
      const registration = {
        userName: 'bigly',
        seedPhrase: 'whoop'
      }
      const auth = new AuthService(backend)
      expect(auth.registerWithSeedPhrase(registration)).to.eventually
        .deep.equal({
          wallet: 'RegSeed'
        })
      expect(backend.registerWithSeedPhrase.called).to.be.true
      expect(backend.registerWithSeedPhrase.calls).to.deep.equal([{
        args: [{
          userName: 'bigly',
          seedPhrase: 'whoop'
        }]
      }])
    })
  })
  describe('registerWithCredentials', () => {
    it('should call backend registerWithCredentials with proper params', () => {
      const backend = {
        registerWithCredentials: stub().returnsAsync('RegPass')
      }
      const registration = {
        userName: 'bigly',
        email: 'j.j@j.c',
        password: 'canyouseeme?'
      }
      const auth = new AuthService(backend)
      expect(auth.registerWithCredentials(registration)).to.eventually
        .deep.equal({
          wallet: 'RegPass'
        })
      expect(backend.registerWithCredentials.called).to.be.true
      expect(backend.registerWithCredentials.calls).to.deep.equal([{
        args: [{
          userName: 'bigly',
          email: 'j.j@j.c',
          password: 'canyouseeme?'
        }]
      }])
    })
  })
  describe('loginWithSeedPhrase', () => {
    it('should call backend loginWithSeedPhrase with proper params', () => {
      const backend = {
        loginWithSeedPhrase: stub().returnsAsync('LogSeed')
      }
      const login = {
        userName: 'bigly',
        seedPhrase: 'whoop',
        pin: '1111'
      }
      const auth = new AuthService(backend)
      expect(auth.loginWithSeedPhrase(login)).to.eventually
        .deep.equal({
          wallet: 'LogSeed'
        })
      expect(backend.loginWithSeedPhrase.called).to.be.true
      expect(backend.loginWithSeedPhrase.calls).to.deep.equal([{
        args: [{
          userName: 'bigly',
          seedPhrase: 'whoop',
          pin: '1111'
        }]
      }])
    })
  })
  describe('loginWithCredentials', () => {
    it('should call backend loginWithCredentials with proper params', () => {
      const backend = {
        loginWithCredentials: stub().returnsAsync('LogPass')
      }
      const login = {
        userName: 'bigly',
        email: 'j.j@j.c',
        pin: '1111',
        password: 'canyouseeme?'
      }
      const auth = new AuthService(backend)
      expect(auth.loginWithCredentials(login)).to.eventually
        .deep.equal({
          wallet: 'LogPass'
        })
      expect(backend.loginWithCredentials.called).to.be.true
      expect(backend.loginWithCredentials.calls).to.deep.equal([{
        args: [{
          userName: 'bigly',
          email: 'j.j@j.c',
          pin: '1111',
          password: 'canyouseeme?'
        }]
      }])
    })
  })
})
