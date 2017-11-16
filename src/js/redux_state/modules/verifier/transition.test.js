import {expect} from 'chai'
import * as transition from './transition'

const reducer = require('./transition').default

describe('# verifier transition redux module', () => {
  describe('# Reducer ', () => {
    it('should initiate properly', () => {
      const state = reducer()
      expect(state.toJS()).to.deep.equal({
        currentStep: 'face'
      })
    })
    it('should set isFaceMatchingId to true on setCurrentStep', () => {
      const state = reducer()
      const action = {
        type: transition.setCurrentStep.id,
        value: 'test'
      }
      expect(reducer(state, action).get('currentStep')).to.equal('test')
    })
  })
})
