import React from 'react'
import { shallow } from 'enzyme'
import WalletPassport from './id-card'

describe('(Component) Wallet Id Card', function() {
  it('should render properly the first time', function() {
    shallow(
      (<WalletPassport
        username={{ value: '' }}
        idCard={{}}
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
