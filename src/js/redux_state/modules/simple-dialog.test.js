/* global describe: true, it: true */
import {expect} from 'chai'
import { actions } from './simple-dialog'
// eslint-disable-next-line
import reducer from './simple-dialog'

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
        actions.configMsg({
          title: 'title',
          message: 'test msg',
          primaryActionText: 'Primary Action Text',
          style: {},
          scrollContent: true
        })).toJS()).to.deep.equal({
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
      const initialState = reducer(undefined, '@INIT')
      expect(reducer(initialState, actions.showDialog())
        .toJS()).to.deep.equal({
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
        actions.hideDialog()).toJS()).to.deep.equal({
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
