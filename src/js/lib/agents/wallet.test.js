/* global describe: true, it: true */
import {expect} from 'chai'
import WalletAgent from 'lib/agents/wallet'
import SolidWalletAgent from 'lib/agents/solid-wallet'

describe('WalletAgent', () => {
  it('should have a SolidAgent', () => {
    const Wallet = new WalletAgent()
    expect(Wallet.solid).to.be.an.instanceof(SolidWalletAgent)
  })
})
