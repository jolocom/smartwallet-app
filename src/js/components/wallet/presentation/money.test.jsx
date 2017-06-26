import React from 'react'
import { shallow } from 'enzyme'
import WalletMoney from './money'

describe('(Component) Wallet Money Presentation', function() {
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
