import React from 'react'
import Immutable from 'immutable'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { stub } from '../../../../../test/utils'
import WalletIdentityScreen from './identity'

describe('(Component) WalletIdentityScreen', () => {
  it('should render properly the first time', () => {
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
              passports: [],
              error: false
            }
          }
        }))
      }
        setFocusedPin={() => {}}
        goToPassportManagement={() => {}}
        goToDrivingLicenceManagement={() => {}}
        goToContactManagement={() => {}}
        getIdentityInformation={() => {}}
        closeConfirmDialog={() => {}}
        openConfirmDialog={() => {}}
        configSimpleDialog={() => {}}
        showSimpleDialog={() => {}}
        startPhoneVerification={() => {}}
        startEmailVerification={() => {}}
        confirmEmail={() => {}}
        confirmPhone={() => {}}
        resendVerificationLink={() => {}}
        resendVerificationSms={() => {}}
        changePinValue={() => {}}
        changeSmsCodeValue={() => {}}
        saveToBlockchain={() => {}}
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
    expect(wrapper.find('WalletIdentity').prop('phones')).to.deep.equal(
      [{number: '+49 176 12345678', type: 'mobile', verified: true}]
    )
    expect(wrapper.find('WalletIdentity').prop('emails')).to.deep.equal(
      [{address: 'info@jolocom.com', type: 'mobile', verified: true}]
    )
    expect(wrapper.find('WalletIdentity').prop('passports')).to.deep.equal([])
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
              contact: {
                emails: [],
                phones: []
              },
              passport: {},
              error: false
            }
          }
        }))
      }
        setFocusedPin={() => {}}
        goToPassportManagement={() => {}}
        goToDrivingLicenceManagement={goToDrivingLicenceManagement}
        goToContactManagement={() => {}}
        getIdentityInformation={() => {}}
        closeConfirmDialog={() => {}}
        openConfirmDialog={() => {}}
        configSimpleDialog={() => {}}
        showSimpleDialog={() => {}}
        startPhoneVerification={() => {}}
        startEmailVerification={() => {}}
        confirmEmail={() => {}}
        confirmPhone={() => {}}
        resendVerificationLink={() => {}}
        resendVerificationSms={() => {}}
        changePinValue={() => {}}
        changeSmsCodeValue={() => {}}
        saveToBlockchain={() => {}}
       />),
      { context: { muiTheme: { } } }
      )

    wrapper.find('WalletIdentity').props().goToDrivingLicenceManagement()
    expect(goToDrivingLicenceManagement.called).to.be.true
    expect(goToDrivingLicenceManagement.calls).to.deep.equal([{args: []}])
  })
  it('should call goToPassportManagement with proper params', () => {
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
        setFocusedPin={() => {}}
        goToPassportManagement={goToPassportManagement}
        goToDrivingLicenceManagement={() => {}}
        goToContactManagement={() => {}}
        getIdentityInformation={() => {}}
        closeConfirmDialog={() => {}}
        openConfirmDialog={() => {}}
        configSimpleDialog={() => {}}
        showSimpleDialog={() => {}}
        startPhoneVerification={() => {}}
        startEmailVerification={() => {}}
        confirmEmail={() => {}}
        confirmPhone={() => {}}
        resendVerificationLink={() => {}}
        resendVerificationSms={() => {}}
        changePinValue={() => {}}
        changeSmsCodeValue={() => {}}
        saveToBlockchain={() => {}}
       />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('WalletIdentity').props().goToPassportManagement()
    expect(goToPassportManagement.called).to.be.true
    expect(goToPassportManagement.calls).to.deep.equal([{args: []}])
  })
  it('should call goToContactManagement with proper params', () => {
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
        setFocusedPin={() => {}}
        goToPassportManagement={() => {}}
        goToDrivingLicenceManagement={() => {}}
        goToContactManagement={goToContactManagement}
        getIdentityInformation={() => {}}
        closeConfirmDialog={() => {}}
        openConfirmDialog={() => {}}
        configSimpleDialog={() => {}}
        showSimpleDialog={() => {}}
        startPhoneVerification={() => {}}
        startEmailVerification={() => {}}
        confirmEmail={() => {}}
        confirmPhone={() => {}}
        resendVerificationLink={() => {}}
        resendVerificationSms={() => {}}
        changePinValue={() => {}}
        changeSmsCodeValue={() => {}}
        saveToBlockchain={() => {}}
       />),
      { context: { muiTheme: { } } }
    )

    wrapper.find('WalletIdentity').props().goToContactManagement()
    expect(goToContactManagement.called).to.be.true
    expect(goToContactManagement.calls).to.deep.equal([{args: []}])
  })
  it('should call getIdentityInformation on componentWillMount with proper params', () => { // eslint-disable-line max-len
    const getIdentityInformation = stub()
    shallow(
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
        setFocusedPin={() => {}}
        goToPassportManagement={() => {}}
        goToDrivingLicenceManagement={() => {}}
        goToContactManagement={() => {}}
        getIdentityInformation={getIdentityInformation}
        closeConfirmDialog={() => {}}
        openConfirmDialog={() => {}}
        configSimpleDialog={() => {}}
        showSimpleDialog={() => {}}
        startPhoneVerification={() => {}}
        startEmailVerification={() => {}}
        confirmEmail={() => {}}
        confirmPhone={() => {}}
        resendVerificationLink={() => {}}
        resendVerificationSms={() => {}}
        changePinValue={() => {}}
        changeSmsCodeValue={() => {}}
        saveToBlockchain={() => {}}
       />),
      { context: { muiTheme: { } } }
    )

    expect(getIdentityInformation.called).to.be.true
    expect(getIdentityInformation.calls).to.deep.equal([{args: []}])
  })
  it('requestVerificationCode should call startPhoneVerification when the attribute type is phone', () => { // eslint-disable-line max-len
    const startPhoneVerification = stub()
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
        setFocusedPin={() => {}}
        goToPassportManagement={() => {}}
        goToDrivingLicenceManagement={() => {}}
        goToContactManagement={() => {}}
        getIdentityInformation={() => {}}
        closeConfirmDialog={() => {}}
        openConfirmDialog={() => {}}
        configSimpleDialog={() => {}}
        showSimpleDialog={() => {}}
        startPhoneVerification={startPhoneVerification}
        startEmailVerification={() => {}}
        confirmEmail={() => {}}
        confirmPhone={() => {}}
        resendVerificationLink={() => {}}
        resendVerificationSms={() => {}}
        changePinValue={() => {}}
        changeSmsCodeValue={() => {}}
        saveToBlockchain={() => {}}
       />),
      { context: { muiTheme: { } } }
    )

    wrapper.instance().requestVerificationCode({
      attrType: 'phone',
      attrValue: '1234',
      index: '2'
    })()
    expect(startPhoneVerification.called).to.be.true
    expect(startPhoneVerification.calls).to.deep.equal([{args: [{
      phone: '1234',
      index: '2'
    }]}])
  })
  it('requestVerificationCode should call startEmailVerification when the attribute type is email', () => { // eslint-disable-line max-len
    const startEmailVerification = stub()
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
        setFocusedPin={() => {}}
        goToDrivingLicenceManagement={() => {}}
        goToContactManagement={() => {}}
        getIdentityInformation={() => {}}
        closeConfirmDialog={() => {}}
        openConfirmDialog={() => {}}
        configSimpleDialog={() => {}}
        showSimpleDialog={() => {}}
        startPhoneVerification={() => {}}
        startEmailVerification={startEmailVerification}
        confirmEmail={() => {}}
        confirmPhone={() => {}}
        resendVerificationLink={() => {}}
        resendVerificationSms={() => {}}
        changePinValue={() => {}}
        changeSmsCodeValue={() => {}}
        saveToBlockchain={() => {}}
       />),
      { context: { muiTheme: { } } }
    )

    wrapper.instance().requestVerificationCode({
      attrType: 'email',
      attrValue: 'test@test.com',
      index: '0'
    })()
    expect(startEmailVerification.called).to.be.true
    expect(startEmailVerification.calls).to.deep.equal([{args: [{
      email: 'test@test.com',
      index: '0'
    }]}])
  })
  it('resendVerificationCode should return resendVerificationSms when the attribute type is phone', () => { // eslint-disable-line max-len
    const resendVerificationSms = stub()
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
        setFocusedPin={() => {}}
        goToDrivingLicenceManagement={() => {}}
        goToContactManagement={() => {}}
        getIdentityInformation={() => {}}
        closeConfirmDialog={() => {}}
        openConfirmDialog={() => {}}
        configSimpleDialog={() => {}}
        showSimpleDialog={() => {}}
        startPhoneVerification={() => {}}
        startEmailVerification={() => {}}
        confirmEmail={() => {}}
        confirmPhone={() => {}}
        resendVerificationLink={() => {}}
        resendVerificationSms={resendVerificationSms}
        changePinValue={() => {}}
        changeSmsCodeValue={() => {}}
        saveToBlockchain={() => {}}
       />),
      { context: { muiTheme: { } } }
    )

    wrapper.instance().resendVerificationCode({
      attrType: 'phone',
      attrValue: '1234',
      index: '0'
    })()
    expect(resendVerificationSms.called).to.be.true
    expect(resendVerificationSms.calls).to.deep.equal([{args: [{
      phone: '1234',
      index: '0'
    }]}])
  })
  it('resendVerificationCode should return resendVerificationLink when the attribute type is email', () => { // eslint-disable-line max-len
    const resendVerificationLink = stub()
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
        setFocusedPin={() => {}}
        goToDrivingLicenceManagement={() => {}}
        goToContactManagement={() => {}}
        getIdentityInformation={() => {}}
        closeConfirmDialog={() => {}}
        openConfirmDialog={() => {}}
        configSimpleDialog={() => {}}
        showSimpleDialog={() => {}}
        startPhoneVerification={() => {}}
        startEmailVerification={() => {}}
        confirmEmail={() => {}}
        confirmPhone={() => {}}
        resendVerificationLink={resendVerificationLink}
        resendVerificationSms={() => {}}
        changePinValue={() => {}}
        changeSmsCodeValue={() => {}}
        saveToBlockchain={() => {}}
       />),
      { context: { muiTheme: { } } }
    )

    wrapper.instance().resendVerificationCode({
      attrType: 'email',
      attrValue: 'test@test.com',
      index: '0'
    })()
    expect(resendVerificationLink.called).to.be.true
    expect(resendVerificationLink.calls).to.deep.equal([{args: [{
      email: 'test@test.com',
      index: '0'
    }]}])
  })
  it('enterVerificationCode should return confirmPhone when the attribute type is phone', () => { // eslint-disable-line max-len
    const confirmPhone = stub()
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
        setFocusedPin={() => {}}
        goToDrivingLicenceManagement={() => {}}
        goToContactManagement={() => {}}
        getIdentityInformation={() => {}}
        closeConfirmDialog={() => {}}
        openConfirmDialog={() => {}}
        configSimpleDialog={() => {}}
        showSimpleDialog={() => {}}
        startPhoneVerification={() => {}}
        startEmailVerification={() => {}}
        confirmEmail={() => {}}
        confirmPhone={confirmPhone}
        resendVerificationLink={() => {}}
        resendVerificationSms={() => {}}
        changePinValue={() => {}}
        changeSmsCodeValue={() => {}}
        saveToBlockchain={() => {}}
       />),
      { context: { muiTheme: { } } }
    )

    wrapper.instance().enterVerificationCode({
      attrType: 'phone',
      attrValue: '1234'
    })()
    expect(confirmPhone.called).to.be.true
    expect(confirmPhone.calls).to.deep.equal([{args: [{
      phone: '1234'
    }]}])
  })
  it('enterVerificationCode should return confirmEmail when the attribute type is email', () => { // eslint-disable-line max-len
    const confirmEmail = stub()
    const wrapper = shallow((<WalletIdentityScreen.WrappedComponent {
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
      setFocusedPin={() => {}}
      goToDrivingLicenceManagement={() => {}}
      goToContactManagement={() => {}}
      getIdentityInformation={() => {}}
      closeConfirmDialog={() => {}}
      openConfirmDialog={() => {}}
      configSimpleDialog={() => {}}
      showSimpleDialog={() => {}}
      startPhoneVerification={() => {}}
      startEmailVerification={() => {}}
      confirmEmail={confirmEmail}
      confirmPhone={() => {}}
      resendVerificationLink={() => {}}
      resendVerificationSms={() => {}}
      changePinValue={() => {}}
      changeSmsCodeValue={() => {}}
      saveToBlockchain={() => {}} />),
      { context: { muiTheme: { } } }
    )

    wrapper.instance().enterVerificationCode({
      attrType: 'email',
      attrValue: 'test@test.com'
    })()
    expect(confirmEmail.called).to.be.true
    expect(confirmEmail.calls).to.deep.equal([{args: [{
      email: 'test@test.com'
    }]}])
  })
  it('should call openConfirmDialog on showVerificationWindow with proper params', () => { // eslint-disable-line max-len
    const openConfirmDialog = stub()
    const wrapper = shallow((<WalletIdentityScreen.WrappedComponent {
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
      setFocusedPin={() => {}}
      goToDrivingLicenceManagement={() => {}}
      goToContactManagement={() => {}}
      getIdentityInformation={() => {}}
      closeConfirmDialog={() => {}}
      openConfirmDialog={openConfirmDialog}
      configSimpleDialog={() => {}}
      showSimpleDialog={() => {}}
      startPhoneVerification={() => {}}
      startEmailVerification={() => {}}
      confirmEmail={() => {}}
      confirmPhone={() => {}}
      resendVerificationLink={() => {}}
      resendVerificationSms={() => {}}
      changePinValue={() => {}}
      changeSmsCodeValue={() => {}}
      saveToBlockchain={() => {}} />),
      { context: { muiTheme: { } } }
    )
    const window = {
      message: '',
      attrValue: '',
      attrType: '',
      index: '',
      rightButtonLabel: '',
      leftButtonLabel: ''
    }
    wrapper.instance().showVerificationWindow(window, () => {})
    expect(openConfirmDialog.called).to.be.true
    expect(openConfirmDialog.calls).to.deep.equal([{
      args: ['', '', undefined, '']
    }])
  })
})
