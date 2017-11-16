/* global describe: true, it: true */
import {expect} from 'chai'
import * as toggleable from './toggleable'
const creator = toggleable.default

describe('Toggleable Module', function() {
  describe('creator', function() {
    let visibility = creator('test', 'test', {initialValue: false})
    it('should return action show', function() {
      expect(visibility.actions.show.id).to.equal(
        'little-sister/test/SHOWTEST'
      )
    })
    it('should return action hide', function() {
      expect(visibility.actions.hide.id).to.equal(
        'little-sister/test/HIDETEST'
      )
    })
    it('should return action toggle', function() {
      expect(visibility.actions.toggle.id).to.equal(
        'little-sister/test/TOGGLETEST'
      )
    })
  })
  describe('reducer actions', function() {
    let visibility = creator('test', 'test', {initialValue: false})
    it('should return true on show', function() {
      expect(visibility.reducer(false,
        {type: 'little-sister/test/SHOWTEST'})).to.equal.true
    })
    it('should return false on hide', function() {
      expect(visibility.reducer(false,
        {type: 'little-sister/test/HIDETEST'})).to.equal.false
    })
    it('should return false on toggle while state is true', function() {
      expect(visibility.reducer(true,
        {type: 'little-sister/test/TOGGLETEST'})).to.equal.false
    })
    it('should return true on toggle while state is false', function() {
      expect(visibility.reducer(false,
        {type: 'little-sister/test/TOGGLETEST'})).to.equal.true
    })
    it('should return original if not an action', function() {
      expect(visibility.reducer(true,
      {type: ''})).to.equal.true
    })
  })
})
