import Immutable from 'immutable'
import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import EtherSendScreen from './ether-send'
import {stub} from '../../../../../test/utils'

describe('(Component) EtherSendScreen', function() {
  it('call updateField with proper params', () => {
    const updateField = stub()
    const wrapper = shallow(
      (<EtherSendScreen.WrappedComponent
        {...EtherSendScreen.mapStateToProps(Immutable.fromJS({
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

        updateField={updateField} />)
    )
    wrapper.instance().updateField('66', 'amountSend')
    expect(updateField.called).to.be.true
    expect(updateField.calls).to.deep.equal([{args: [{value: '66', field: 'amountSend'}]}]) // eslint-disable-line max-len
  })
})
