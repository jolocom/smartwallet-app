import {expect} from 'chai'
import {actions} from './face'
import reducer from './face'

describe('# verifier face redux module', () => {
  describe('# Reducer ', () => {
    it('should initiate properly', () => {
      const state = reducer()
      expect(state.toJS()).to.deep.equal({isFaceMatchingId: false})
    })
    it('should set isFaceMatchingId to true on confirmFaceIdCardMatch', () => {
      const state = reducer()
      const action = {
        type: actions.confirmFaceIdCardMatch.id
      }
      expect(reducer(state, action).get('isFaceMatchingId')).to.be.true
    })
  })
})
