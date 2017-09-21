import Immutable from 'immutable'
import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import EtherTabScreen from './ether-tabs'
import {stub} from '../../../../../test/utils'

describe('(Component) EtherTabScreen', function() {
  it('call detectTab with the current path', function() {
    const detectActiveTab = stub()
    const switchTab = stub()

    const wrapper = shallow(
      (<EtherTabScreen.WrappedComponent
        {...EtherTabScreen.mapStateToProps(Immutable.fromJS({wallet: {
          etherTabs: {activeTab: 'overview'}
        }}))}
        retrieveEtherBalance={() => {}}
        detectActiveTab={detectActiveTab}
        switchTab={switchTab}
        location={{pathname: 'testtest'}}
      />)
    )

    wrapper.instance().componentDidMount()
    expect(detectActiveTab.calls).to.deep.equal([{args: [{path: 'testtest'}]}])

    wrapper.instance().componentDidUpdate()
    expect(detectActiveTab.calls).to.deep.equal([
      {args: [{path: 'testtest'}]},
      {args: [{path: 'testtest'}]}
    ])
  })
  it('should call switchTab on tab click', function() {
    const detectActiveTab = stub()
    const switchTab = stub()

    const wrapper = shallow(
      (<EtherTabScreen.WrappedComponent
        {...EtherTabScreen.mapStateToProps(Immutable.fromJS({wallet: {
          etherTabs: {activeTab: 'overview'}
        }}))}
        retrieveEtherBalance={() => {}}
        detectActiveTab={detectActiveTab}
        switchTab={switchTab}
        location={{pathname: 'testtest'}}
      />)
    )

    wrapper.find('Tabs').prop('onChange')('MYTAB')
    expect(switchTab.calls).to.deep.equal([
      {args: [{tab: 'MYTAB'}]}
    ])
  })
  it('should call retrieveEtherBalance on componentWillMount', function() {
    const retrieveEtherBalance = stub()

    const wrapper = shallow(
      (<EtherTabScreen.WrappedComponent
        {...EtherTabScreen.mapStateToProps(Immutable.fromJS({wallet: {
          etherTabs: {activeTab: 'overview'}
        }}))}
        retrieveEtherBalance={retrieveEtherBalance}
        detectActiveTab={() => {}}
        switchTab={() => {}}
        location={{}}
      />)
    )

    wrapper.instance()
    expect(retrieveEtherBalance.called).to.be.true
  })
})
