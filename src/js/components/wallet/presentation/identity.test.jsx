import React from 'react'
import { shallow } from 'enzyme'
import WalletIdentity from './identity'

describe('(Component) Wallet Identity', function() {
  it('should render properly the first time', function() {
    shallow(
      (<WalletIdentity
        username={{ value: '' }}
        passports={[]}
        idCards={[]}
        isLoaded
        webId={''}
        emails={[{
          type: '',
          address: '',
          verified: false
        }]}
        phones={[{
          type: '',
          number: '',
          verified: false
        }]}
        expandedFields={{
          contact: false,
          idCards: false,
          passports: false
        }}
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
