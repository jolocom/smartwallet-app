import React from 'react'
import { shallow } from 'enzyme'
import WalletEther from './ether-wallet'

describe('(Component) WalletEther', function() {
  it('should render properly the first time', () => {
    shallow((<WalletEther
      onToken={() => {}}
      goToAccountDetailsEthereum={() => {}}
      ether={{
        screenToDisplay: '',
        walletAddress: '',
        ether: {
          loaded: false,
          errorMsg: '',
          price: 0,
          amount: 0,
          checkingOut: false,
          buying: false
        }
      }}
      wallet={{
        loading: false,
        errorMsg: '',
        walletAddress: '',
        amount: '',
        receiverAddress: '',
        amountSend: '',
        pin: '1234',
        data: '',
        gasInWei: '200'
      }}
    />))
  })
})
