import React from 'react'
import { shallow } from 'enzyme'
import LaymanLogin from './layman'

describe('(Login Component) Layman', function() {
  it('should render properly the first time', function() {
    shallow((<LaymanLogin
      back={() => {}}
      username=""
      password=""
      onUsernameChange={() => {}}
      onPasswordChange={() => {}}
      onSubmit={() => {}}
      failed
      />),
      { context: { muiTheme: { } } }
    )
  })
})
