/* global describe: true, it: true */
import {expect} from 'chai'
import * as simpleDialog from './simple-dialog'
const reducer = simpleDialog.default

describe('Simple dialog reducer', function() {
  describe('INIT', function() {
    it('should correctly initialize', function() {
      expect(reducer(undefined, '@INIT').toJS()).to.deep.equal({
        visible: false,
        message: '',
        primaryActionText: 'OK'
      })
    })
  })

  describe('configSimpleDialog', function() {
    it('should correctly handle the configSimpleDialog action', function() {
      expect(reducer(reducer(undefined, '@INIT'),
        simpleDialog.configSimpleDialog(
        'test msg', 'Primary Action Text',
      )).toJS()).to.deep.equal({
        visible: false,
        message: 'test msg',
        primaryActionText: 'Primary Action Text'
      })
    })
  })
  describe('showSimpleDialog', function() {
    it('should correctly handle the showSimpleDialog action', function() {
      expect(reducer(reducer(undefined, '@INIT'),
        simpleDialog.showSimpleDialog()).toJS()).to.deep.equal({
          visible: true,
          message: '',
          primaryActionText: 'OK'
        })
    })
  })
  describe('hideSimpleDialog', function() {
    it('should correctly handle the hideSimpleDialog action', function() {
      expect(reducer(reducer(undefined, '@INIT'),
        simpleDialog.hideSimpleDialog()).toJS()).to.deep.equal({
          visible: false,
          message: '',
          primaryActionText: 'OK'
        })
    })
  })
})
