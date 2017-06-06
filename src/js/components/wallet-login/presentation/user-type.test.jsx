import React from 'react'
import { shallow } from 'enzyme'
import LoginUserType from './layman'

describe('(Login Component) LoginUserType', function() {
  it('should render properly the first time', function() {
    shallow((<LoginUserType
      value=""
      valid
      onSelect={() => {}}
      onWhySelect={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
