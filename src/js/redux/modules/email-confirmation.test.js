/* global describe: true, it: true */
import {expect} from 'chai'
import * as emailConfirmation from './email-confirmation'
const reducer = require('./email-confirmation').default

describe('Email Confirmation reducer', function() {
  describe('INIT', function() {
    it('should correctly initialize', function() {
      expect(reducer(undefined, '@@INIT').toJS()).to.deep.equal({
        success: false,
        loading: true
      })
    })
  })

  describe('#actions confirm', function() {
    it('should update to success on confirm success', function() {
      let state = reducer(undefined, '@@INIT')
      const action = {
        type: emailConfirmation.actions.confirm.id_success
      }
      expect(reducer(state, action).toJS()).to.deep.equal({
        success: true,
        loading: false
      })
    })
    it('should update to fail on confirm fail', function() {
      let state = reducer(undefined, '@@INIT')
      const action = {
        type: emailConfirmation.actions.confirm.id_fail
      }
      expect(reducer(state, action).toJS()).to.deep.equal({
        success: false,
        loading: false
      })
    })
  })
})
