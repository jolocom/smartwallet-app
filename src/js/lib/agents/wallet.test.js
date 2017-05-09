/* global describe: true, it: true */
import {expect} from 'chai'
import {Wallet} from 'lib/agents/wallet'
import SolidAgent from 'lib/agents/solid-wallet'

describe('Wallet', () => {
  it('should have a SolidAgent', () => {
    const WalletInstance = new Wallet()
    expect(WalletInstance.solid).to.be.an.instanceof(SolidAgent)
  })
})
