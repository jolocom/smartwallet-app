/* global describe: true, it: true */
import Immutable from 'immutable'
import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import WalletTabScreen from './tabs'
import {stub} from '../../../../../test/utils'

describe.only('(Component) WalletTabScreen', function() {
  it('call detectTab with the current path', function() {
    const detectActiveTab = stub()
    const switchTab = stub()

    const wrapper = shallow(
      (<WalletTabScreen.WrappedComponent id="test" visible
        {...WalletTabScreen.mapStateToProps(Immutable.fromJS({wallet: {
          tabs: {activeTab: null}
        }}))}
        detectActiveTab={detectActiveTab} switchTab={switchTab}
        location={{pathname: 'bla'}}
      />)
    )

    wrapper.instance().componentDidMount()
    expect(detectActiveTab.calls).to.deep.equal([{args: [{path: 'bla'}]}])

    wrapper.instance().componentDidUpdate()
    expect(detectActiveTab.calls).to.deep.equal([
      {args: [{path: 'bla'}]},
      {args: [{path: 'bla'}]}
    ])
  })

  it('should call switchTab on tab click', function() {
    const detectActiveTab = stub()
    const switchTab = stub()

    const wrapper = shallow(
      (<WalletTabScreen.WrappedComponent id="test" visible
        {...WalletTabScreen.mapStateToProps(Immutable.fromJS({wallet: {
          tabs: {activeTab: null}
        }}))}
        detectActiveTab={detectActiveTab} switchTab={switchTab}
        location={{pathname: 'bla'}}
      />)
    )

    wrapper.find('Tabs').prop('onChange')('aTab')
    expect(switchTab.calls).to.deep.equal([
      {args: [{tab: 'aTab'}]}
    ])
  })
})
