import React from 'react'
import { shallow } from 'enzyme'
import WalletEther from './ether-wallet'

describe('(Component) WalletEther', function() {
  it('should render properly the first time', () => {
    shallow((<WalletEther
      buyEther={() => {}}
      ether={{
        ether: {
          amount: 0,
          buying: false,
          checkingOut: false,
          loaded: false,
          price: 0
        }
      }}
    />))
  })
})
