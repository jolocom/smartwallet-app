import {expect} from 'chai'
import VerificationAgent from './verification'
import HttpAgent from './http'

describe('#VerificationAgent', () => {
  describe('Instance Attributes', () => {
    it('should have an http agent', () => {
      const verification = new VerificationAgent()
      expect(verification.httpAgent).to.be.instanceof(HttpAgent)
    })
  })
})
