import Immutable from 'immutable'
import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import WalletHomeScreen from './home'
import {stub} from '../../../../../test/utils'

describe('(Component) WalletHomeScreen', () => {
  it('call goTo button on click', () => {
    const goTo = stub()
    const getIdentityInformation = stub()
    const wrapper = shallow((<WalletHomeScreen.WrappedComponent
      {...WalletHomeScreen.mapStateToProps(Immutable.fromJS({wallet: {
        identity: {
          username: {
            value: 'test'
          }
        }
      }}))}
      goTo={goTo}
      getIdentityInformation={getIdentityInformation} />)
    )
    wrapper.find('WalletHome').props().onClick()
    expect(goTo.calls).to.deep.equal([
      {args: ['identity']}
    ])
  })
})
