import React from 'react'
import Immutable from 'immutable'
import {expect} from 'chai'
import {shallow} from 'enzyme'
import Presentation from '../presentation/money'
import WalletMoneyScreen from './money'

describe('(Component) WalletMoneyScreen', () => {
  it('should render properly the first time', () => {
    const wrapper = shallow(
      (<WalletMoneyScreen.WrappedComponent {
        ...WalletMoneyScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            money: {
              ether: {
                loaded: false,
                errorMsg: '',
                price: 0,
                amount: 0,
                checkingOut: false,
                buying: false
              }
            }
          }
        }))
      }
        goToEtherManagement={() => {}}
        buyEther={() => {}}
        getPrice={() => {}}
        getBalance={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
    expect(wrapper.find(Presentation).prop('ether')).to.deep.equal({
      loaded: false,
      errorMsg: '',
      price: 0,
      amount: 0,
      checkingOut: false,
      buying: false
    })
  })
})
