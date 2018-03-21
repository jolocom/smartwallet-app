/* global describe: true, it: true */
import {expect} from 'chai'
import * as verification from './verification'
const reducer = require('./verification').default

describe('Email Confirmation reducer', function() {
  describe('INIT', function() {
    it('should correctly initialize', function() {
      expect(reducer(undefined, '@@INIT').toJS()).to.deep.equal({
        success: false,
        loading: true
      })
    })
  })

  describe('#actions confirmEmail', function() {
    it('should update to success on confirm success', function() {
      let state = reducer(undefined, '@@INIT')
      const action = {
        type: verification.actions.confirmEmail.id_success
      }
      expect(reducer(state, action).toJS()).to.deep.equal({
        success: true,
        loading: false
      })
    })
    it('should update to fail on confirm fail', function() {
      let state = reducer(undefined, '@@INIT')
      const action = {
        type: verification.actions.confirmEmail.id_fail
      }
      expect(reducer(state, action).toJS()).to.deep.equal({
        success: false,
        loading: false
      })
    })
  })
})
