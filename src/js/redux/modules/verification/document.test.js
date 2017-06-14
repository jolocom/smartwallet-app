import {expect} from 'chai'
import * as document from './document'

const reducer = require('./document').default

describe('# verification document redux module', () => {
  describe('# Reducer ', () => {
    it('should initiate properly', () => {
      expect(reducer().toJS()).to.deep.equal({type: ''})
    })
    it('should set choose document to value on chooseDocument', () => {
      const state = reducer()
      const action = {
        type: document.chooseDocument.id,
        value: 'idCard'
      }
      expect(reducer(state, action).toJS()).to.deep.equal({type: 'idCard'})
    })
  })
})
