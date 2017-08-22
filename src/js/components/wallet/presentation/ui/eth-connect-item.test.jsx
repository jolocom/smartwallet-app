import React from 'react'
import { shallow } from 'enzyme'
import EthConnectItem from './eth-connect-item'

describe('(Component) EthConnectItem', function() {
  it('should render properly the first time', function() {
    shallow((<EthConnectItem
      createEthereumIdentity={() => {}}
      onToken={() => {}}
      confirmDialog={() => {}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
