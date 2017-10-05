import Immutable from 'immutable'
import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import WalletContactScreen from './contact'
import {stub} from '../../../../../test/utils'

describe('(Component) WalletContactScreen', () => {
  const fake = () => null
  const callback = '/wallet/identity'
  it('should call getUserInformation to start', () => {
    const getUserInformation = stub()
    const location = {query: {callbackUrl: '/wallet/identity'}}
    shallow(
      (<WalletContactScreen.WrappedComponent id="test" visible
        {...WalletContactScreen.mapStateToProps(Immutable.fromJS({wallet: {
          contact: {
            loading: false,
            getDataFromBackend: true,
            information: {}
          }
        }}))}
        location={location}
        getUserInformation={getUserInformation}
        updateInformation={fake}
        setInformation={fake}
        deleteInformation={fake}
        exitWithoutSaving={fake}
        saveChanges={fake}
        addNewEntry={fake}
        confirm={fake} />)
    )
    expect(getUserInformation.calls).to.deep.equal([{args: [callback]}])
  })
  it('should set focused to value', () => {
    const location = {query: {callbackUrl: '/wallet/identity'}}
    const getUserInformation = stub()
    const wrapper = shallow(
     (<WalletContactScreen.WrappedComponent id="test" visible
       {...WalletContactScreen.mapStateToProps(Immutable.fromJS({wallet: {
         contact: {
           loading: false,
           information: {}
         }
       }}))}
       location={location}
       getUserInformation={getUserInformation}
       updateInformation={fake}
       setInformation={fake}
       deleteInformation={fake}
       exitWithoutSaving={fake}
       saveChanges={fake}
       addNewEntry={fake}
       confirm={fake}
     />)
    )
    wrapper.instance()._onFocusChange('boo')
    expect(wrapper.state()).to.deep.equal({
      focused: 'boo'
    })
  })
})
