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
                phones: [{
                  number: '+49 176 12345678',
                  type: 'mobile',
                  verified: true
                }],
                emails: [{
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
              },
              error: false
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
      phones: [{number: '+49 176 12345678', type: 'mobile', verified: true}],
      emails: [{address: 'info@jolocom.com', type: 'mobile', verified: true}]
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
              passport: {},
              error: false
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
                phones: [],
                emails: []
              },
              passport: {},
              error: false
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
                phones: [],
                emails: []
              },
              passport: {},
              error: false
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
              passport: {},
              error: false
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
  it('should call openConfirmDialog on onConfirm with proper params', () => {
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
              passport: {},
              error: false
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

    wrapper.find('WalletIdentity').props().onConfirm({
      message: 'message',
      attrValue: '',
      style: {}
    })
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
    const startEmailConfirmation = stub()
    const wrapper = shallow(
      (<WalletIdentityScreen.WrappedComponent {
        ...WalletIdentityScreen.mapStateToProps(Immutable.fromJS({
          wallet: {
            identity: {
              loaded: false,
              webId: '',
              username: {},
              contact: {},
              passport: {},
              error: false
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
        showSimpleDialog={showSimpleDialog}
        configSimpleDialog={configSimpleDialog}
        startEmailConfirmation={startEmailConfirmation}
       />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('WalletIdentity').props().onVerify({
      message: 'message',
      buttonText: 'OK',
      style: {},
      attrValue: 'test@test.com'
    })
    expect(configSimpleDialog.called).to.be.true
    expect(showSimpleDialog.called).to.be.true
    expect(configSimpleDialog.calls).to.have.lengthOf(1)
    const [callback, msg, text, ...rest] = configSimpleDialog.calls[0].args
    expect({msg, text}).to.deep.equal({msg: 'message', 'text': 'OK'})
    expect(rest).to.have.lengthOf(1)
    expect(showSimpleDialog.calls).to.deep.equal([{args: []}])

    callback()
    expect(startEmailConfirmation.calls).to.deep.equal([{args: [{
      email: 'test@test.com'
    }]}])
  })
})
