/* global describe: true, it: true */
import {expect} from 'chai'
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
      timeout = global.setTimeout
      global.setTimeout = stub({returns: 2})
    })
    after(() => {
      global.setTimeout = timeout
    })

    it('should correctly handle the showMessage action', function() {
      const thunkAction = snackBar.showMessage({
        message: 'test msg'
      })
      const dispatch = stub()
      thunkAction(dispatch)
      /* eslint-disable */
      expect(dispatch.called).to.be.true
      /* eslint-enable */
      expect(dispatch.calledWithArgs).to.deep.equal([{
        type: snackBar.showMessage.id,
        message: 'test msg',
        id: 2
      }])
      /* eslint-disable */
      expect(setTimeout.called).to.be.true
      /* eslint-enable */
      expect(setTimeout.calledWithArgs[1]).to.equal(4000)

      dispatch.called = false
      setTimeout.calledWithArgs[0]()
      /* eslint-disable */
      expect(dispatch.called).to.be.true
      /* eslint-enable */
      expect(dispatch.calledWithArgs).to.deep.equal([{
        type: snackBar.closeShownMessage.id,
        id: 2
      }])
    })
  })

  describe('closeShownMessage', () => {
    it('should correctly close a shown message', () => {
      let state = reducer()

      state = reducer(state, snackBar.showMessage.buildAction({
        message: 'test', id: 1
      }))
      expect(state.toJS()).to.deep.equal({
        open: true,
        message: 'test',
        undo: false,
        undoCallback: null,
        id: 1
      })

      state = reducer(state, snackBar.closeShownMessage({id: 1}))
      expect(state.toJS()).to.deep.equal({
        open: false,
        message: '',
        undo: false,
        undoCallback: null,
        id: null
      })
    })

    it('should ignore requests to close old messages', () => {
      let state = reducer()

      state = reducer(state, snackBar.showMessage.buildAction({
        message: 'test', id: 1
      }))
      expect(state.toJS()).to.deep.equal({
        open: true,
        message: 'test',
        undo: false,
        undoCallback: null,
        id: 1
      })

      state = reducer(state, snackBar.closeShownMessage({id: 2}))
      expect(state.toJS()).to.deep.equal({
        open: true,
        message: 'test',
        undo: false,
        undoCallback: null,
        id: 1
      })
    })
  })
})
