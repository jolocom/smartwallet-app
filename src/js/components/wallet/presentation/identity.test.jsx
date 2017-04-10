import React from 'react'
import { shallow } from 'enzyme'
import WalletIdentity from './identity'

describe.only('(Component) Wallet Identity', function() {
  it('should render properly the first time', function() {
    shallow(
      (<WalletIdentity
      	username={{}}
		passport={{}}
		isLoaded
		contact={{email:[], phone: []}}
		goToContactManagement={() => {}}
		goToPassportManagement={() => {}}
		goToDivingLicenceManagement={() => {}}

      />),
      { context: { muiTheme: { } } }
    )
  })
})
