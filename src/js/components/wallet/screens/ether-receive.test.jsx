import Immutable from 'immutable'
import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import EtherReceiveScreen from './ether-receive'
import {stub} from '../../../../../test/utils'

describe('(Component) EtherReiceiveScreen', function() {
  it('call getWalletAddress on ComponentWillMount', () => {
    const retrieveEtherBalance = stub()
    const wrapper = shallow(
      (<EtherReceiveScreen.WrappedComponent
        {...EtherReceiveScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            etherTabs: {
              activeTab: 'overview',
              wallet: {
                loading: false,
                mainAddress: '',
                amount: '',
                receiverAddress: '',
                amountSend: '',
                pin: '1234',
                data: '',
                gasInWei: '200'
              }
            },
            money: {
              screenToDisplay: '',
              mainAddress: '',
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
        }))}
        retrieveEtherBalance={retrieveEtherBalance} />)
    )
    wrapper.instance()
    expect(retrieveEtherBalance.called).to.be.true
  })
})
