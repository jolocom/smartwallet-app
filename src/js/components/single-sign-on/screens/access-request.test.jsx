import React from 'react'
import Immutable from 'immutable'
import {expect} from 'chai'
import {shallow} from 'enzyme'
import AccessRequestScreen from './access-request'
// import Presentation from '../presentation/access-request'
import {stub} from '../../../../../test/utils'

describe('(Component) AccessRequestScreen', () => {
  it('should call requestedDetails and getIdentityInformation to start on componentWillMount', () => { // eslint-disable-line max-len
    const requestedDetails = stub()
    const getIdentityInformation = stub()
    const wrapper = shallow((<AccessRequestScreen.WrappedComponent
      {...AccessRequestScreen.mapStateToProps(Immutable.fromJS({
        wallet: {
          identity: {
            loaded: false,
            error: false,
            webId: '',
            username: {
              verified: false,
              value: ''
            },
            contact: {
              phones: [{
                type: '',
                number: '111',
                verified: false,
                smsCode: '',
                pin: '',
                pinFocused: false
              }],
              emails: [{
                type: '',
                address: '',
                pin: '',
                verified: false
              }]
            },
            passports: [
              {
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
            ]
          }
        },
        singleSignOn: {
          accessRequest: {
            entity: {
              loading: false,
              name: 'SOME COMPANY',
              image: 'img/logo.svg',
              requester: '',
              returnURL: '',
              fields: ['phone', 'email']
            }
          }
        }
      }))
    }
      requestedDetails={requestedDetails}
      getIdentityInformation={getIdentityInformation}
      requestedFields={[]}
      location={{}}
      identity={{}}
      entity={{}}
      accessInfo={() => {}}
      grantAccessToRequester={() => {}} />
    ))
    wrapper.instance()
    expect(requestedDetails.called).to.be.true
  })

  it('should call handleWhy with proper params', () => {
    const configSimpleDialog = stub()
    const accessInfo = stub()
    const wrapper = shallow((<AccessRequestScreen.WrappedComponent
      {...AccessRequestScreen.mapStateToProps(Immutable.fromJS({
        wallet: {
          identity: {
            loaded: false,
            error: false,
            webId: '',
            username: {
              verified: false,
              value: ''
            },
            contact: {
              phones: [{
                type: '',
                number: '111',
                verified: false,
                smsCode: '',
                pin: '',
                pinFocused: false
              }],
              emails: [{
                type: '',
                address: '',
                pin: '',
                verified: false
              }]
            },
            passports: [
              {
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
            ]
          }
        },
        singleSignOn: {
          accessRequest: {
            entity: {
              loading: false,
              name: 'SOME COMPANY',
              image: 'img/logo.svg',
              requester: '',
              returnURL: 'www.test.com',
              fields: []
            }
          }
        }
      }))}
      configSimpleDialog={configSimpleDialog}
      showSimpleDialog={() => {}}
      requestedDetails={() => {}}
      getIdentityInformation={() => {}}
      requestedFields={[]}
      location={{}}
      identity={{}}
      entity={{}}
      accessInfo={accessInfo}
      grantAccessToRequester={() => {}} />
    ))
    wrapper.instance().handleWhy('test title', 'test message')
    expect(configSimpleDialog.called).to.be.true
    expect(configSimpleDialog.calls).to.deep.equal([{args:
      ['test title', 'test message', 'OK', {}, false]
    }])
  })
})
