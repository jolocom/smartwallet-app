import React from 'react'
import { shallow } from 'enzyme'
import CountrySelectPresentation from './country'

describe('(Component) CountrySelectPresentation', () => {
  it('should render properly the first time', () => {
    shallow((<CountrySelectPresentation
      submit={() => {}}
      change={() => {}}
      cancel={() => {}}
      countries={[]}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
