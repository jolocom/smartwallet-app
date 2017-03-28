import React from 'react'
import { shallow } from 'enzyme'
import Password from './name-entry'

describe('(Component) Password', function() {
  it('should render properly the first time', function() {
    shallow((<Password
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
