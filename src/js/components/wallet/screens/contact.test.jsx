/* global describe: true, it: true */
import Immutable from 'immutable'
import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import WalletContactScreen from './contact'
import {stub} from '../../../../../test/utils'

describe('(Component) WalletContactScreen', function() {
  it('should call getAccountInformation to start', function() {
    const getAccountInformation = stub()

    const wrapper = shallow(
      (<WalletContactScreen.WrappedComponent id="test" visible
        {...WalletContactScreen.mapStateToProps(Immutable.fromJS({wallet: {
          contact: {}
        }}))}
        getAccountInformation={getAccountInformation}
      />)
    )

    wrapper.instance().componentDidMount()
    expect(getAccountInformation.calls).to.deep.equal([{args: []}])
  })
  it('should set focused to value', function() {
    const wrapper = shallow(
     (<WalletContactScreen.WrappedComponent id="test" visible
       {...WalletContactScreen.mapStateToProps(Immutable.fromJS({wallet: {
         contact: {}
       }}))}
     />)
    )
    wrapper.instance()._onFocusChange('boo')
    expect(wrapper.state()).to.deep.equal({
      focused: 'boo'
    })
  })
})
