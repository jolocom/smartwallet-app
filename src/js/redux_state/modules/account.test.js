import {expect} from 'chai'
import {stub} from '../../../../test/utils'
import snackBar from './snack-bar'
import {actions} from './account'
import reducer from './account'

describe('Account module reducer', function() {
  describe('INIT', function() {
    it('should correctly initialize', function() {
      expect(reducer(undefined, '@INIT').toJS()).to.deep.equal({
        did: ''
      })
    })
  })
})

