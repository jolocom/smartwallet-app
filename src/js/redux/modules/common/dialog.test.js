/* global describe: true, it: true */
import {expect} from 'chai'
import * as dialog from './dialog'
const reducer = dialog.default

describe('Dialog reducer', function() {
  describe('INIT', function() {
    it('should correctly initialize', function() {
      expect(reducer(undefined, '@INIT').toJS()).to.deep.equal({
      })
    })
  })

  describe('show', function() {
    it('should correctly show a new dialog', function() {
      let state = reducer(undefined, '@INIT')

      state = reducer(state, dialog.show({id: 'test'}))
      expect(state.toJS()).to.deep.equal({
        test: {visible: true}
      })
    })
    it('should correctly show an existing hidden dialog', function() {
      let state = reducer(undefined, '@INIT')

      state = reducer(state, dialog.hide({id: 'test'}))
      state = reducer(state, dialog.show({id: 'test'}))
      expect(state.toJS()).to.deep.equal({
        test: {visible: true}
      })
    })
  })

  describe('hide', function() {
    it('should correctly hide a new dialog', function() {
      let state = reducer(undefined, '@INIT')

      state = reducer(state, dialog.hide({id: 'test'}))
      expect(state.toJS()).to.deep.equal({
        test: {visible: false}
      })
    })
    it('should correctly hide an existing shown dialog', function() {
      let state = reducer(undefined, '@INIT')

      state = reducer(state, dialog.show({id: 'test'}))
      state = reducer(state, dialog.hide({id: 'test'}))
      expect(state.toJS()).to.deep.equal({
        test: {visible: false}
      })
    })
  })

  describe('toggle', function() {
    it('should correctly toggle the visibility of a shown dialog', function() {
      let state = reducer(undefined, '@INIT')

      state = reducer(state, dialog.show({id: 'test'}))
      state = reducer(state, dialog.toggle({id: 'test'}))
      expect(state.toJS()).to.deep.equal({
        test: {visible: false}
      })
    })
    it('should correctly toggle the visibility of a hidden dialog', function() {
      let state = reducer(undefined, '@INIT')

      state = reducer(state, dialog.hide({id: 'test'}))
      state = reducer(state, dialog.toggle({id: 'test'}))
      expect(state.toJS()).to.deep.equal({
        test: {visible: true}
      })
    })
  })
})
