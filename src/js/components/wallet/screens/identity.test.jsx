import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import WalletIdentityScreen from './identity'

describe('(Component) WalletIdentityScreen', function() {
  it('should render properly the first time', function() {
    const wrapper = shallow(
      (<WalletIdentityScreen.WrappedComponent {
        ...WalletIdentityScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            identity: {
              loaded: false,
              webId: 'https://demo.webid.jolocom.com/profile/card',
              username: {
                verified: true,
                value: 'AnnikaHamman'
                },
              contact: {
                phone: [{
                  number: '+49 176 12345678',
                  type: 'mobile',
                  verified: true
                }],
                email: [{
                    address: 'info@jolocom.com',
                    type: 'mobile',
                    verified: true
                }]
              },
              passport: {
                number: '',
                givenName: '',
                familyName: '',
                birthDate: '',
                age: '',
                gender: '',
                showAddress: '',
                streetAndNumber: '',
                city: '',
                zip: '',
                state: '',
                country: '',
                verified: false
              }
            }
          }
        }))
      }
        goToPassportManagement={() => {}}
        goToDivingLicenceManagement={() => {}}
        goToContactManagement={() => {}}
        getIdentityInformation={() => {}}
      />),
      { context: { muiTheme: { } } }
    )

    expect(wrapper.find('WalletIdentity').prop('webId'))
      .to.equal('https://demo.webid.jolocom.com/profile/card')
    expect(wrapper.find('WalletIdentity').prop('isLoaded')).to.be.false
    expect(wrapper.find('WalletIdentity').prop('username')).to.deep.equal({
      verified: true,
      value: 'AnnikaHamman'
    })
    expect(wrapper.find('WalletIdentity').prop('contact')).to.deep.equal({
      phone: [{number: '+49 176 12345678', type: 'mobile', verified: true}],
      email: [{address: 'info@jolocom.com', type: 'mobile', verified: true}]
    })
     expect(wrapper.find('WalletIdentity').prop('passport')).to.deep.equal({
      number: '',givenName: '',familyName: '',birthDate: '',age: '',gender: '',
      showAddress: '', streetAndNumber: '', city: '', zip: '', state: '',
      country: '', verified: false
    })
  })
  it('should call goToDivingLicenceManagement on goToDivingLicenceManagement ' +
    'with proper params', function() {
      const goToDivingLicenceManagement = stub()
      const wrapper = shallow(
        (<WalletIdentityScreen.WrappedComponent {
          ...WalletIdentityScreen.mapStateToProps(Immutable.fromJS({
            wallet: {
              identity: {
                loaded: false,
                webId: '',
                username: {},
                contact: {},
                passport: {}
              }
            }
          }))
        }
          goToPassportManagement={() => {}}
          goToDivingLicenceManagement={goToDivingLicenceManagement}
          goToContactManagement={() => {}}
          getIdentityInformation={() => {}}
        />),
        { context: { muiTheme: { } } }
      )

      wrapper.find('WalletIdentity').props().goToDivingLicenceManagement()
      expect(goToDivingLicenceManagement.called).to.be.true
      expect(goToDivingLicenceManagement.calls).to.deep.equal([{ args: []}])
    }
  )
  it('should call goToPassportManagement on goToPassportManagement ' +
    'with proper params', function() {
      const goToPassportManagement = stub()
      const wrapper = shallow(
        (<WalletIdentityScreen.WrappedComponent {
          ...WalletIdentityScreen.mapStateToProps(Immutable.fromJS({
            wallet: {
              identity: {
                loaded: false,
                webId: '',
                username: {},
                contact: {
                  phone: [],
                  email: []
                },
                passport: {}
              }
            }
          }))
        }
          goToPassportManagement={goToPassportManagement}
          goToDivingLicenceManagement={() => {}}
          goToContactManagement={() => {}}
          getIdentityInformation={() => {}}
        />),
        { context: { muiTheme: { } } }
      )

      wrapper.find('WalletIdentity').props().goToPassportManagement()
      expect(goToPassportManagement.called).to.be.true
      expect(goToPassportManagement.calls).to.deep.equal([{ args: []}])
    }
  )
  it('should call goToContactManagement on goToContactManagement ' +
    'with proper params', function() {
      const goToContactManagement = stub()
      const wrapper = shallow(
        (<WalletIdentityScreen.WrappedComponent {
          ...WalletIdentityScreen.mapStateToProps(Immutable.fromJS({
            wallet: {
              identity: {
                loaded: false,
                webId: '',
                username: {},
                contact: {
                  phone: [],
                  email: []
                },
                passport: {}
              }
            }
          }))
        }
          goToPassportManagement={() => {}}
          goToDivingLicenceManagement={() => {}}
          goToContactManagement={goToContactManagement}
          getIdentityInformation={() => {}}
        />),
        { context: { muiTheme: { } } }
      )

      wrapper.find('WalletIdentity').props().goToContactManagement()
      expect(goToContactManagement.called).to.be.true
      expect(goToContactManagement.calls).to.deep.equal([{ args: []}])
    }
  )
  it('should call getIdentityInformation on componentWillMount   ' +
    'with proper params', function() {
      const getIdentityInformation = stub()
      const wrapper = shallow(
        (<WalletIdentityScreen.WrappedComponent {
          ...WalletIdentityScreen.mapStateToProps(Immutable.fromJS({
            wallet: {
              identity: {
                loaded: false,
                webId: '',
                username: {},
                contact: {},
                passport: {}
              }
            }
          }))
        }
          goToPassportManagement={() => {}}
          goToDivingLicenceManagement={() => {}}
          goToContactManagement={() => {}}
          getIdentityInformation={getIdentityInformation}
        />),
        { context: { muiTheme: { } } }
      )

      expect(getIdentityInformation.called).to.be.true
      expect(getIdentityInformation.calls).to.deep.equal([{ args: []}])
    }
  )
})
