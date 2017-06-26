import React from 'react'
import { shallow } from 'enzyme'
import EtherWallet from './ether-wallet'

describe('(Component) EtherWallet', function() {
  it('should render properly the first time', function() {
    shallow((<EtherWallet
      />),
      { context: { muiTheme: { } } }
    )
  })
})
