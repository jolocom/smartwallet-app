import React from 'react'
import { shallow } from 'enzyme'
import WalletPassport from './id-card'

describe('(Component) Wallet Id Card Presentation', function() {
  it('should render properly the first time', function() {
    shallow(
      (<WalletPassport
        save={() => {}}
        showVerifierLocations={() => {}}
        change={() => {}}
        selectCountry={() => {}}
        cancel={() => {}}
        showVerifiers={() => {}}
        loaded
        focusedGroup=""
        focusedField=""
        setFocused={() => {}}
        verifierLocations
        showErrors
        showAddress
        physicalAddress={[]}
        idCard={[]}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
