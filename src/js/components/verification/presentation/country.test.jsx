import React from 'react'
import { shallow } from 'enzyme'
import CountrySelectPresentation from './country'

describe('(Component) CountrySelectPresentation', function() {
  it('should render properly the first time', function() {
    shallow((<CountrySelectPresentation
      countries={[]}
      value=""
      submit={() => {}}
      change={() => {}}
      cancel={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
