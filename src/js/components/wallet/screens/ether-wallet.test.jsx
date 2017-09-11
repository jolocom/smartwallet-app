import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import EtherWalletScreen from './ether-wallet'
import {StyleRoot} from 'radium'
// import Presentation from '../presentation/ether-wallet'
import {stub} from '../../../../../test/utils'

describe('(Component) EtherWalletScreen', () => {
  it('should render properly the first time', () => {
    const retrieveEtherBalance = stub()
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
        retrieveEtherBalance={retrieveEtherBalance}
        goToAccountDetailsEthereum={() => {}}
    />)
    ,
    { context: { muiTheme: { } } }
  )
    wrapper.instance().componentDidMount()
    expect(retrieveEtherBalance.called).to.be.true
  })
})
