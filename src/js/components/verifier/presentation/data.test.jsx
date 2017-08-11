import React from 'react'
import { shallow } from 'enzyme'
import VerificationDataPresentation from './data'

describe('(Component) VerificationDataPresentation', function() {
  it('should render properly the first time', () => {
    shallow((<VerificationDataPresentation
      verify={() => {}}
      showVerifierLocations
      change={() => {}}
      username={{value: ''}}
      selectCountry={() => {}}
      cancel={() => {}}
      showVerifiers={() => {}}
      focusedGroup="person"
      focusedField="number"
      setFocused={() => {}}
      verifierLocations={[]}
      showErrors
      showAddress
      physicalAddress={[]}
      idCard={[]}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
