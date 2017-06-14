import {expect} from 'chai'
import * as result from './result'

const reducer = require('./result').default

describe.only('# verification result redux module', () => {
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
      const action = {type: result.startComparingData.id_success}
      expect(reducer(state, action).toJS()).to.deep.equal({
        loading: false,
        success: true,
        numberOfFails: 0
      })
    })
    it('should set loading to false and false true on startComparingData fails', () => { // eslint-disable-line max-len
      const state = reducer()
      const action = {type: result.startComparingData.id_fail}
      expect(reducer(state, action).toJS()).to.deep.equal({
        loading: false,
        success: false,
        numberOfFails: 1
      })
    })
  })
})
