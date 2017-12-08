import {expect} from 'chai'
import {actions} from './transition'
import reducer from './transition'

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
        type: actions.setCurrentStep.id,
        value: 'test'
      }
      expect(reducer(state, action).get('currentStep')).to.equal('test')
    })
  })
})
