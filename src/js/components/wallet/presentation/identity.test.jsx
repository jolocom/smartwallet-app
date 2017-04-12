import React from 'react'
import { shallow } from 'enzyme'
import WalletIdentity from './identity'

describe('(Component) Wallet Identity', function() {
  it('should render properly the first time', function() {
    shallow(
      (<WalletIdentity
        username={{}}
        passport={{}}
        isLoaded
        contact={{email: [], phone: []}}
        goToContactManagement={() => {}}
        goToPassportManagement={() => {}}
        goToDrivingLicenceManagement={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
