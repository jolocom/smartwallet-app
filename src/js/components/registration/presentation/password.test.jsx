import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import Password from './name-entry'

describe('(Component) Password', function() {
  it('should render properly the first time', function() {
    const wrapper = shallow((<Password
        value={''}
        repeated={''}
        valid={false}
        repeatedValue={''}
        passwordStrengthErrorMessage={''}
        passwordsMatchErrorMessage={''}
        hasDigit={false}
        hasLowerCase={false}
        hasUpperCase={false}
        repeatedValueState={false}
        strength={'weakt'}
        onSubmit={() => {}}
        onChangePassword={() => {}}
        onChangeRepeatedPassword={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
