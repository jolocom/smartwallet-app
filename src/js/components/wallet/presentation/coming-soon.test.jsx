import React from 'react'
import { shallow } from 'enzyme'
import WalletComingSoon from './coming-soon'

describe('(Component) WalletComingSoon', function() {
  it('should render properly the first time', function() {
    shallow((<WalletComingSoon
      message=""
      />),
      { context: { muiTheme: { } } }
    )
  })
})
