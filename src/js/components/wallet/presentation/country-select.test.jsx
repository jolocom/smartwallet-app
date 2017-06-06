import React from 'react'
import { shallow } from 'enzyme'
import CountrySelectPresentation from './country-select'

describe('(Component) CountrySelectPresentation', function() {
  it('should render properly the first time', function() {
    shallow((<CountrySelectPresentation
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
      verifierLocations={[]}
      showErrors
      showAddress
      physicalAddress={[]}
      passport={[]}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
