import React from 'react'
import { shallow } from 'enzyme'
import WalletHome from './home'

describe('(Component) WalletHome', function() {
  it('should render properly the first time', function() {
    shallow((<WalletHome
      onClick={() => {}}
      username=""
      />),
      { context: { muiTheme: { } } }
    )
  })
})
