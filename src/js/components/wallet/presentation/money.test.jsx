import React from 'react'
import { shallow } from 'enzyme'
import WalletMoney from './money'

describe.only('(Component) Wallet Money', function() {
  it('should render properly the first time', function() {
    shallow(
      (<WalletMoney
        goToEtherManagement={() => {}}
        ether={{}}
      />),
      { context: { muiTheme: { } } }
    )
  })
})
