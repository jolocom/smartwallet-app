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
                loaded: false,
                errorMsg: '',
                price: 0,
                amount: 0,
                checkingOut: false,
                buying: false
              }
            },
            etherTabs: {
              activeTab: 'overview',
              wallet: {
                loading: false,
                errorMsg: '',
                walletAddress: '',
                amount: '',
                receiverAddress: '',
                amountSend: '',
                pin: '1234',
                data: '',
                gasInWei: '200'
              }
            }
          }
        })
      )}
        buyEther={() => {}}
        goToWalletScreen={() => {}}
        goToAccountDetailsEthereum={() => {}}
    />),
    { context: { muiTheme: { } } }
  )
    expect(wrapper.find('WalletEther')).to.have.length(1)
    expect(wrapper.find('WalletEther')).prop('ether').to.deep.equal({
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
})
