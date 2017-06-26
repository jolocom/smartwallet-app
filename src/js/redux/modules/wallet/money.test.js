import {expect} from 'chai'
import * as actions from './money'
const reducer = require('./money').default

describe.only('# Wallet money redux module', () => {
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
    it('should update the user\'s amount of ether on getBalance success', () => { // eslint-disable-line max-len
      const state = reducer(undefined, '@@INIT')
      const action = {
        type: actions.getBalance.id_success,
        result: 2
      }
      expect(reducer(state, action).getIn(['ether', 'amount'])).to.equal(2)
    })
    it('should update the ether\'s price of ether on getPrice success', () => {
      const state = reducer(undefined, '@@INIT')
      const action = {
        type: actions.getPrice.id_success,
        result: {ethForEur: 2}
      }
      expect(reducer(state, action).getIn(['ether', 'price'])).to.equal(2)
    })
    it('should set loaded to true and errorMsg to empty on buyEther success', () => { // eslint-disable-line max-len
      const state = reducer(undefined, '@@INIT')
      const action = {
        type: actions.buyEther.id_success
      }
      expect(reducer(state, action).getIn(['ether']).toJS()).to.deep.equal({
        loaded: true,
        errorMsg: '',
        price: 0,
        amount: 0,
        checkingOut: false,
        buying: false
      })
    })
    it('should set the error msg when getPrice fails', () => {
      const state = reducer(undefined, '@@INIT')
      const action = {type: actions.getPrice.id_fail}
      expect(reducer(state, action).getIn(['ether']).toJS()).to.deep.equal({
        loaded: true,
        errorMsg: 'Could not get the ether price',
        price: 0,
        amount: 0,
        checkingOut: false,
        buying: false
      })
    })
    it('should set the error msg when getBalance fails', () => {
      const state = reducer(undefined, '@@INIT')
      const action = {type: actions.getBalance.id_fail}
      expect(reducer(state, action).getIn(['ether']).toJS()).to.deep.equal({
        loaded: true,
        errorMsg: 'Could not get the user\'s ether balance',
        price: 0,
        amount: 0,
        checkingOut: false,
        buying: false
      })
    })
    it('should set the error msg when buyEther fails', () => {
      const state = reducer(undefined, '@@INIT')
      const action = {type: actions.buyEther.id_fail}
      expect(reducer(state, action).getIn(['ether']).toJS()).to.deep.equal({
        loaded: true,
        errorMsg: 'Could not buy ether',
        price: 0,
        amount: 0,
        checkingOut: false,
        buying: false
      })
    })
  })
})
