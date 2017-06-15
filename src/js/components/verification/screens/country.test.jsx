import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import Immutable from 'immutable'
import CountryVerificationScreen from './country'
import Presentation from '../presentation/country'
import {stub} from '../../../../../test/utils'

describe.only('(Component) CountryVeri     ficationScreen', () => {
  it('should render properly the first time', () => {
    const setCountryValue = stub()
    const chooseCountry = stub()
    const wrapper = shallow((<CountryVerificationScreen
      verification={{verification: country: {value: '', type: []}}}
      setCountryValue={setCountryValue}
      chooseCountry={chooseCountry}
      cancelCountrySelection={() => {}} />),
      { context: { muiTheme: {} } }
    )
  })
})
