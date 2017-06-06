import React from 'react'
import { shallow } from 'enzyme'
import WalletPassport from './passport'

describe.only('(Component) Wallet Identity', function() {
  it('should render properly the first time', function() {
    shallow(
      (<WalletPassport
        username={{ value: '' }}
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
        isError
      />),
      { context: { muiTheme: { } } }
    )
  })
})
