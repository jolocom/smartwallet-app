/* global describe: true, it: true */
import {expect} from 'chai'
import * as simpleDialog from './simple-dialog'
const reducer = simpleDialog.default

describe('Simple dialog reducer', function() {
  describe('INIT', function() {
    it('should correctly initialize', function() {
      expect(reducer(undefined, '@INIT').toJS()).to.deep.equal({
        visible: false,
        scrollContent: false,
        title: '',
        message: '',
        primaryActionText: 'OK',
        style: {}
      })
    })
  })

  describe('configSimpleDialog', function() {
    it('should correctly handle the configSimpleDialog action', function() {
      expect(reducer(reducer(undefined, '@INIT'),
        simpleDialog.configSimpleDialog(
        'title', 'test msg', 'Primary Action Text', {}, true
      )).toJS()).to.deep.equal({
        visible: false,
        scrollContent: true,
        title: 'title',
        message: 'test msg',
        primaryActionText: 'Primary Action Text',
        style: {}
      })
    })
  })
  describe('showSimpleDialog', function() {
    it('should correctly handle the showSimpleDialog action', function() {
      expect(reducer(reducer(undefined, '@INIT'),
        simpleDialog.showSimpleDialog()).toJS()).to.deep.equal({
          visible: true,
          scrollContent: false,
          title: '',
          message: '',
          primaryActionText: 'OK',
          style: {}
        })
    })
  })
  describe('hideSimpleDialog', function() {
    it('should correctly handle the hideSimpleDialog action', function() {
      expect(reducer(reducer(undefined, '@INIT'),
        simpleDialog.hideSimpleDialog()).toJS()).to.deep.equal({
          visible: false,
          scrollContent: false,
          title: '',
          message: '',
          primaryActionText: 'OK',
          style: {}
        })
    })
  })
})
