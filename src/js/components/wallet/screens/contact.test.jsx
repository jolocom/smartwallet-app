/* global describe: true, it: true */
import Immutable from 'immutable'
import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import WalletContactScreen from './contact'
import {stub} from '../../../../../test/utils'

describe('(Component) WalletContactScreen', () => {
  const fake = () => null
  it('should call getAccountInformation to start', () => {
    const getAccountInformation = stub()
    shallow(
      (<WalletContactScreen.WrappedComponent id="test" visible
        {...WalletContactScreen.mapStateToProps(Immutable.fromJS({wallet: {
          contact: {
            loading: false,
            information: {}
          }
        }}))}
        getAccountInformation={getAccountInformation}
        updateInformation={fake}
        setInformation={fake}
        deleteInformation={fake}
        exitWithoutSaving={fake}
        saveChanges={fake}
        addNewEntry={fake}
        confirm={fake}
        close={fake}
      />)
    )
    expect(getAccountInformation.calls).to.deep.equal([{args: []}])
  })
  it('should set focused to value', () => {
    const wrapper = shallow(
     (<WalletContactScreen.WrappedComponent id="test" visible
       {...WalletContactScreen.mapStateToProps(Immutable.fromJS({wallet: {
         contact: {
           loading: false,
           information: {}
         }
       }}))}
       getAccountInformation={fake}
       updateInformation={fake}
       setInformation={fake}
       deleteInformation={fake}
       exitWithoutSaving={fake}
       saveChanges={fake}
       addNewEntry={fake}
       confirm={fake}
       close={fake}
     />)
    )
    wrapper.instance()._onFocusChange('boo')
    expect(wrapper.state()).to.deep.equal({
      focused: 'boo'
    })
  })
})
