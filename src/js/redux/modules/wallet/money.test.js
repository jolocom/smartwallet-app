import {expect} from 'chai'
import * as actions from './money'
const reducer = require('./money').default

describe('# Wallet money redux module', () => {
  describe('# Reducer', () => {
    it('should initialise properly', () => {
      const state = reducer(undefined, '@@INIT')
      expect(state.toJS()).to.deep.equal({
        ether: {
          loaded: false,
          errorMsg: '',
          price: 0,
          amount: 0,
          checkingOut: false,
          buying: false
        }
      })
    })
    it('should upage the user\'s amount of ether on getBalance success', () => {
      const state = reducer(undefined, '@@INIT')
      const action = {
        type: actions.getBalance.id_success,
        result: 2
      }
      expect(reducer(state, action).getIn(['ether', 'amount'])).to.equal(2)
    })
    it('should upage the ether\'s price of ether on getPrice success', () => {
      const state = reducer(undefined, '@@INIT')
      const action = {
        type: actions.getPrice.id_success,
        result: {ethForEur: 2}
      }
      expect(reducer(state, action).getIn(['ether', 'price'])).to.equal(2)
    })
  })
})
