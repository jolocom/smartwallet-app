import React from 'react'
import { shallow } from 'enzyme'
import WalletError from './error'

describe('(Component) WalletError', function() {
  it('should render properly the first time', function() {
    shallow((<WalletError
      onClick={() => {}}
      message=""
      buttonLabel=""
      />),
      { context: { muiTheme: { } } }
    )
  })
})
