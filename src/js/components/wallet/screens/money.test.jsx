import React from 'react'
import Immutable from 'immutable'
import {expect} from 'chai'
import {shallow} from 'enzyme'
import {stub} from '../../../../../test/utils'
import Presentation from '../presentation/money'
import WalletMoneyScreen from './money'

describe('(Component) WalletMoneyScreen', () => {
  it('should render properly the first time', () => {
    const wrapper = shallow(
      (<WalletMoneyScreen.WrappedComponent {
        ...WalletMoneyScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            money: {
              ether: {
                loaded: false,
                errorMsg: '',
                price: 0,
                amount: 0,
                checkingOut: false,
                buying: false
              }
            }
          }
        }))
      }
        goToEtherManagement={() => {}}
        buyEther={() => {}}
        getPrice={() => {}}
        getWalletAddressAndBalance={() => {}} />),
      { context: { muiTheme: { } } }
    )
    expect(wrapper.find(Presentation).prop('ether')).to.deep.equal({
      loaded: false,
      errorMsg: '',
      price: 0,
      amount: 0,
      checkingOut: false,
      buying: false
    })
  })
  it('should call goToEtherManagement with the right params', () => {
    const goToEtherManagement = stub()
    const wrapper = shallow(
      (<WalletMoneyScreen.WrappedComponent {
        ...WalletMoneyScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            money: {
              ether: {
                loaded: false,
                errorMsg: '',
                price: 0,
                amount: 0,
                checkingOut: false,
                buying: false
              }
            }
          }
        }))
      }
        goToEtherManagement={goToEtherManagement}
        buyEther={() => {}}
        getPrice={() => {}}
        getWalletAddressAndBalance={() => {}} />),
      { context: { muiTheme: { } } }
    )
    wrapper.find(Presentation).props().goToEtherManagement()
    expect(goToEtherManagement.called).to.be.true
    expect(goToEtherManagement.calls).to.deep.equal([{args: []}])
  })
  it('should call getPrice on componentWillMount', () => {
    const getPrice = stub()

    shallow(
      (<WalletMoneyScreen.WrappedComponent {
        ...WalletMoneyScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            money: {
              ether: {
                loaded: false,
                errorMsg: '',
                price: 0,
                amount: 0,
                checkingOut: false,
                buying: false
              }
            }
          }
        }))
      }
        goToEtherManagement={() => {}}
        getPrice={getPrice}
        getWalletAddressAndBalance={() => {}} />),
      { context: { muiTheme: { } } }
    )
    expect(getPrice.called).to.be.true
    expect(getPrice.calls).to.deep.equal([{args: []}])
  })
})
