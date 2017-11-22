import {expect} from 'chai'
import {stub} from '../../../../test/utils'
import * as snackBar from './snack-bar'
import * as account from './account'
const reducer = account.default

describe('Account module reducer', function() {
  let origShowMessage

  beforeEach(() => {
    localStorage.clear()

    origShowMessage = snackBar.showMessage
    snackBar.showMessage = stub()
  })

  afterEach(() => {
    localStorage.clear()
    snackBar.showMessage = origShowMessage
  })

  describe('INIT', function() {
    it('should correctly initialize', function() {
      expect(reducer(undefined, '@INIT').toJS()).to.deep.equal({
        username: '',
        userExists: false,
        loggedIn: false
      })
    })
  })

// TODO: write new tests for login

// TODO: write new tests for logout
})

