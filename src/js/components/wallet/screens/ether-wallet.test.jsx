import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import EtherWalletScreen from './ether-wallet'

describe('(Component) EtherWalletScreen', () => {
  it('should render properly the first time', () => {
    const wrapper = shallow(
      (<EtherWalletScreen.WrappedComponent
        {...EtherWalletScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            money: {
              ether: {
                amount: 0,
                buying: false,
                checkingOut: false,
                loaded: false,
                price: 0
              }}}
        })
      )}
        getEther={() => {}}
    />),
    { context: { muiTheme: { } } }
  )
    expect(wrapper.find('WalletEther')).to.have.length(1)
    expect(wrapper.find('WalletEther')).prop('ether').to.deep.equal({
      ether: {
        amount: 0,
        buying: false,
        checkingOut: false,
        loaded: false,
        price: 0
      }
    })
  })
})
