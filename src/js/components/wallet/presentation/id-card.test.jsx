import React from 'react'
import { shallow } from 'enzyme'
import WalletIdCard from './id-card'

describe('(Component) Wallet Id Card Presentation', () => {
  it('should render properly the first time', () => {
    const idCard = Array.apply(null, Array(24)).map(() => ({value: ''}))
    shallow((<WalletIdCard
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
      idCard={idCard}
    />),
    { contextTypes: { muiTheme: { } } }
    )
  })
})
