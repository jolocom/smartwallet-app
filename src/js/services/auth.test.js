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
    it('should call backend register with the proper params', async () => {
      const backend = {
        gateway: {register: stub().returnsAsync({wallet: 'RegSeed'})}
      }
      const registration = {
        userName: 'bigly',
        seedPhrase: 'whoop',
        inviteCode: null
      }
      const auth = new AuthService(backend)
      const result = await auth.register(registration)
      expect(result).to.deep.equal({
        wallet: 'RegSeed'
      })
      expect(backend.gateway.register.called).to.be.true
      expect(backend.gateway.register.calls).to.deep.equal([{
        args: [{
          userName: 'bigly',
          seedPhrase: 'whoop',
          inviteCode: null
        }]
      }])
    })
  })
})
