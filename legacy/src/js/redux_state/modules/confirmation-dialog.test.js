/* global describe: true, it: true */
import {expect} from 'chai'
// eslint-disable-next-line
import {actions} from './confirmation-dialog'
// eslint-disable-next-line
import reducer from './confirmation-dialog'

describe('Confirmation dialog reducer', function() {
  describe('INIT', function() {
    it('should correctly initialize', function() {
      expect(reducer(undefined, '@INIT').toJS()).to.deep.equal({
        open: false,
        message: '',
        primaryActionText: 'Confirm',
        callback: null,
        cancelActionText: '',
        style: {}
      })
    })
  })

  describe('confirm', function() {
    it('should correctly handle the confirm action', function() {
      const callback = () => {}
      const initialState = reducer(undefined, '@INIT')
      expect(reducer(initialState, actions.openConfirmDialog({
        title: 'test title',
        message: 'test msg',
        primaryActionText: 'Primary Action Text',
        callback
      })).toJS()).to.deep.equal({
        open: true,
        title: 'test title',
        message: 'test msg',
        primaryActionText: 'Primary Action Text',
        callback,
        cancelActionText: '',
        style: {}
      })
    })
  })
})
