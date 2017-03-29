import React from 'react'
import { shallow } from 'enzyme'
import Password from './name-entry'

describe('(Component) Password', function() {
  it('should render properly the first time', function() {
    shallow((<Password
      value=""
      repeated=""
      valid
      repeatedValue=""
      passwordStrengthErrorMessage=""
      passwordsMatchErrorMessage=""
      hasDigit
      hasLowerCase
      hasUpperCase
      repeatedValueState
      strength=""
      onSubmit={() => {}}
      onChangePassword={() => {}}
      onChangeRepeatedPassword={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
