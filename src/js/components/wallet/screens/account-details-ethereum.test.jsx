import Immutable from 'immutable'
import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import AccountDetailsEthereumScreen from './account-details-ethereum'
// import Presentation from '../presentation/account-details-ethereum'
import {stub} from '../../../../../test/utils'

describe('(Component) AccountDetailsEthereumScreen', function() {
  it('getWalletAddress should be called on componentWillMount', function() {
    const getWalletAddress = stub()
    const wrapper = shallow(
      (<AccountDetailsEthereumScreen.WrappedComponent
        {...AccountDetailsEthereumScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            etherTabs: {
              activeTab: 'overview',
              wallet: {
                loading: false,
                mainAddress: '',
                receiverAddress: '',
                amountSend: '',
                pin: '',
                data: '',
                gasInWei: ''
              }
            }
          }
        }))}
        closeAccountDetails={() => {}}
        getWalletAddress={getWalletAddress} />)
      )
    wrapper.instance()
    expect(getWalletAddress.called).to.be.true
  })
})
