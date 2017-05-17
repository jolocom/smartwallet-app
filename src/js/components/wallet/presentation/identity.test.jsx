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
        webId={''}
        contact={{
          emails: [{
            type: '',
            address: '',
            verified: false
          }],
          phones: [{
            type: '',
            number: '',
            verified: false
          }]}}
        goToContactManagement={() => {}}
        goToPassportManagement={() => {}}
        goToDrivingLicenceManagement={() => {}}
        onConfirm={() => {}}
        onVerify={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
