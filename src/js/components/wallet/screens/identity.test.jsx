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
        goToDrivingLicenceManagement={() => {}}
        goToContactManagement={() => {}}
        getIdentityInformation={() => {}}
        closeConfirmDialog={() => {}}
        openConfirmDialog={() => {}}
        configSimpleDialog={() => {}}
        showSimpleDialog={() => {}}
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
      number: '', givenName: '', familyName: '', birthDate: '', gender: '',
      showAddress: '', streetAndNumber: '', city: '', zip: '', state: '',
      country: '', verified: false
    })
  })
  it('should call goToDrivingLicenceManagement with proper params', () => {
    const goToDrivingLicenceManagement = stub()
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
        goToDrivingLicenceManagement={goToDrivingLicenceManagement}
        goToContactManagement={() => {}}
        getIdentityInformation={() => {}}
        closeConfirmDialog={() => {}}
        openConfirmDialog={() => {}}
        configSimpleDialog={() => {}}
        showSimpleDialog={() => {}}
       />),
      { context: { muiTheme: { } } }
      )

    wrapper.find('WalletIdentity').props().goToDrivingLicenceManagement()
    expect(goToDrivingLicenceManagement.called).to.be.true
    expect(goToDrivingLicenceManagement.calls).to.deep.equal([{args: []}])
  })
  it('should call goToPassportManagement on goToPassportManagement ' +
    'with proper params', () => {
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
        goToDrivingLicenceManagement={() => {}}
        goToContactManagement={() => {}}
        getIdentityInformation={() => {}}
        closeConfirmDialog={() => {}}
        openConfirmDialog={() => {}}
        configSimpleDialog={() => {}}
        showSimpleDialog={() => {}}
       />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('WalletIdentity').props().goToPassportManagement()
    expect(goToPassportManagement.called).to.be.true
    expect(goToPassportManagement.calls).to.deep.equal([{args: []}])
  })
  it('should call goToContactManagement on goToContactManagement ' +
    'with proper params', () => {
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
        goToDrivingLicenceManagement={() => {}}
        goToContactManagement={goToContactManagement}
        getIdentityInformation={() => {}}
        closeConfirmDialog={() => {}}
        openConfirmDialog={() => {}}
        configSimpleDialog={() => {}}
        showSimpleDialog={() => {}}
       />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('WalletIdentity').props().goToContactManagement()
    expect(goToContactManagement.called).to.be.true
    expect(goToContactManagement.calls).to.deep.equal([{args: []}])
  })
  it('should call getIdentityInformation on componentWillMount ' +
    'with proper params', () => {
    const getIdentityInformation = stub()
    shallow(
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
        goToDrivingLicenceManagement={() => {}}
        goToContactManagement={() => {}}
        getIdentityInformation={getIdentityInformation}
        closeConfirmDialog={() => {}}
        openConfirmDialog={() => {}}
        configSimpleDialog={() => {}}
        showSimpleDialog={() => {}}
       />),
      { context: { muiTheme: { } } }
    )

    expect(getIdentityInformation.called).to.be.true
    expect(getIdentityInformation.calls).to.deep.equal([{args: []}])
  })
  it('should call openConfirmDialog on confirm with proper params', () => {
    const openConfirmDialog = stub()
    const closeConfirmDialog = stub()
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
        goToDrivingLicenceManagement={() => {}}
        goToContactManagement={() => {}}
        getIdentityInformation={() => {}}
        openConfirmDialog={openConfirmDialog}
        closeConfirmDialog={closeConfirmDialog}
        configSimpleDialog={() => {}}
        showSimpleDialog={() => {}}
       />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('WalletIdentity').props().confirm('message', {})
    expect(openConfirmDialog.called).to.be.true
    expect(openConfirmDialog.calls[0].args[0]).to.equal('message')
    expect(openConfirmDialog.calls[0].args[1]).to.equal('REQUEST VERIFICATION')
    expect(openConfirmDialog.calls[0].args[3]).to.equal('OK')
    expect(openConfirmDialog.calls[0].args[4]).to.deep.equal({})

    openConfirmDialog.calls[0].args[2]()
    expect(closeConfirmDialog.called).to.be.true
    expect(closeConfirmDialog.calls).to.deep.equal([{args: []}])
  })
  it('should call openConfirmDialog on verify with proper params', () => {
    const configSimpleDialog = stub()
    const showSimpleDialog = stub()
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
        goToDrivingLicenceManagement={() => {}}
        goToContactManagement={() => {}}
        getIdentityInformation={() => {}}
        openConfirmDialog={() => {}}
        closeConfirmDialog={() => {}}
        configSimpleDialog={configSimpleDialog}
        showSimpleDialog={showSimpleDialog}

       />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('WalletIdentity').props().verify('message', 'OK', {})
    expect(configSimpleDialog.called).to.be.true
    expect(showSimpleDialog.called).to.be.true
    expect(configSimpleDialog.calls).to.deep.equal([{args: [
      'message', 'OK', {}
    ]}])
    expect(showSimpleDialog.calls).to.deep.equal([{args: []}])
  })
})
