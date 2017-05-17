import React from 'react'
import { shallow } from 'enzyme'
import WalletIdentity from './identity'

describe('(Component) Wallet Identity', function() {
  it('should render properly the first time', function() {
    shallow(
      (<WalletIdentity
        username={{ value: '' }}
        passport={{}}
        isLoaded
        webId={''}
        contact={{
          email: [{
            type: '',
            address: '',
            verified: false
          }],
          phone: [{
            type: '',
            number: '',
            verified: false
          }]}}
        goToContactManagement={() => {}}
        goToPassportManagement={() => {}}
        goToDrivingLicenceManagement={() => {}}
        confirm={() => {}}
        verify={() => {}}
        isError
      />),
      { context: { muiTheme: { } } }
    )
  })
})
