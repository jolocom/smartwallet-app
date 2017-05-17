/* global describe: true, it: true */
import Immutable from 'immutable'
import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import WalletHomeScreen from './home'
import {stub} from '../../../../../test/utils'

describe('(Component) WalletHomeScreen', function() {
  it('call goToIdentity button on click', function() {
    const goToIdentity = stub()
    const getIdentityInformation = stub()

    const wrapper = shallow(
      (<WalletHomeScreen.WrappedComponent id="test" visible
        {...WalletHomeScreen.mapStateToProps(Immutable.fromJS({wallet: {
          identity: {
            username: {
              value: 'test'
            }
          }
        }}))}
        goToIdentity={goToIdentity}
        getIdentityInformation={getIdentityInformation}
      />)
    )
    wrapper.find('WalletHome').props().onClick()
    expect(goToIdentity.calls).to.deep.equal([
      {args: []}
    ])
  })
})
