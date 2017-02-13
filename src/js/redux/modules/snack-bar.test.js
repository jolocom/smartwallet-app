/* global describe: true, it: true */
import {expect} from 'chai'
import * as sinon from 'sinon'
import * as snackBar from './snack-bar'
import {stub} from '../../../../test/utils'
const reducer = snackBar.default

describe('Snack bar reducer', function() {
  describe('INIT', function() {
    it('should correctly initialize', function() {
      expect(reducer(undefined, '@INIT').toJS()).to.deep.equal({
        open: false,
        message: '',
        undo: false,
        undoCallback: null,
        id: null
      })
    })
  })

  describe('showMessage', function() {
    let timeout
    before(() => {
      timeout = window.setTimeout
      window.setTimeout = stub({returns: 2})
    })
    after(() => {
      window.setTimeout = timeout
    })

    it('should correctly handle the showMessage action', function() {
      const thunkAction = snackBar.showMessage({
        message: 'test msg'
      })
      const dispatch = stub()
      thunkAction(dispatch)
      expect(dispatch.called).to.be.true
      expect(dispatch.calledWithArgs).to.deep.equal([{
        type: snackBar.showMessage.id, message: 'test msg',
        id: 2
      }])

      expect(setTimeout.called).to.be.true
      expect(setTimeout.calledWithArgs[1]).to.equal(4000)

      dispatch.called = false
      setTimeout.calledWithArgs[0]()
      expect(dispatch.called).to.be.true
      expect(dispatch.calledWithArgs).to.deep.equal([{
        type: snackBar.closeShownMessage.id,
        id: 2
      }])
    })
  })
})
