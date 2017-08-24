import Immutable from 'immutable'
import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import EtherTabScreen from './ether-tabs'
import {stub} from '../../../../../test/utils'

// describe('(Component) WalletTabScreen', function() {
//   it('call detectTab with the current path', function() {
//     const detectActiveTab = stub()
//     const switchTab = stub()
//
//     const wrapper = shallow(
//       (<EtherTabScreen.WrappedComponent
//         {...EtherTabScreen.mapStateToProps(Immutable.fromJS({wallet: {
//           tabs: {activeTab: 'overview'}
//         }}))}
//         detectActiveTab={detectActiveTab}
//         switchTab={switchTab}
//         location={{pathname: 'testtest'}}
//       />)
//     )
// })
