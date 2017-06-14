import {expect} from 'chai'
import * as face from './face'

const reducer = require('./face').default

describe.only('# verification face redux module', () => {
  describe('# Reducer ', () => {
    it('should initiate properly', () => {
      const state = reducer()
      expect(state.toJS()).to.deep.equal({isFaceMatchingId: false})
    })
    it('should set isFaceMatchingId to true on confirmFaceIdCardMatch', () => {
      const state = reducer()
      const action = {
        type: face.confirmFaceIdCardMatch.id
      }
      expect(reducer(state, action).get('isFaceMatchingId')).to.be.true
    })
  })
})
