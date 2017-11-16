import {expect} from 'chai'
import * as result from './result'

const reducer = require('./result').default

describe('# verifier result redux module', () => {
  describe('# Reducer ', () => {
    it('should initiate properly', () => {
      const state = reducer()
      expect(state.toJS()).to.deep.equal({
        loading: true,
        success: false,
        numberOfFails: 0
      })
    })
    it('should set loading to true on startComparingData', () => {
      const state = reducer()
      const action = {
        type: result.startComparingData.id
      }
      expect(reducer(state, action).toJS()).to.deep.equal({
        loading: true,
        success: false,
        numberOfFails: 0
      })
    })
    it('should set loading to false and success to true on startComparingData success', () => { // eslint-disable-line max-len
      const state = reducer()
      const action = {
        type: result.startComparingData.id_success,
        result: true
      }
      expect(reducer(state, action).toJS()).to.deep.equal({
        loading: false,
        success: true,
        numberOfFails: 0
      })
    })
    it('should set loading and success to false when data does not much with the client identity', () => { // eslint-disable-line max-len
      const state = reducer()
      const action = {
        type: result.startComparingData.id_success,
        result: false
      }
      expect(reducer(state, action).toJS()).to.deep.equal({
        loading: false,
        success: false,
        numberOfFails: 1
      })
    })
  })
})
