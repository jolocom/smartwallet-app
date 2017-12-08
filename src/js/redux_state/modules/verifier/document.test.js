import { expect } from 'chai'
import { actions } from './document'
import reducer from './document'

describe('# verifier document redux module', () => {
  describe('# Reducer ', () => {
    it('should initiate properly', () => {
      expect(reducer().toJS()).to.deep.equal({type: ''})
    })
    it('should set choose document to value on chooseDocument', () => {
      const state = reducer()
      const action = {
        type: actions.chooseDocument.id,
        value: 'idCard'
      }
      expect(reducer(state, action).toJS()).to.deep.equal({type: 'idCard'})
    })
  })
})
