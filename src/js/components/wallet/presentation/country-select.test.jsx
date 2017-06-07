import React from 'react'
import { shallow } from 'enzyme'
import CountrySelectPresentation from './country-select'

describe('(Component) CountrySelectPresentation', function() {
  it('should render properly the first time', function() {
    shallow((<CountrySelectPresentation
      countries={[]}
      submit={() => {}}
      change={() => {}}
      value={() => {}}
      cancel={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
