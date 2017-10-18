import React from 'react'
import Immutable from 'immutable'
import {expect} from 'chai'
import {shallow} from 'enzyme'
import ApprovalRequest from './approval-request'
import {stub} from '../../../../../test/utils'

describe('(Component) ApprovalRequest', () => {
  const location = {
    query: {
      contractID: 'test-natascha-contract',
      method: 'setTest',
      'params[]': 'testing',
      requester: 'http://localhost:5678/joe',
      returnURL: 'https://google.de',
      value: '0.0'
    }
  }
  it('should call getRequestedDetails on componentWillMount', () => {
    const getRequestedDetails = stub()
    const retrieveEtherBalance = stub()
    const wrapper = shallow((<ApprovalRequest.WrappedComponent
      {...ApprovalRequest.mapStateToProps(Immutable.fromJS({
        wallet: {
          money: {
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
          }
        },
        ethereumConnect: {
          loading: false,
          errorMsg: '',
          expanded: false,
          fundsNotSufficient: false,
          requesterName: 'Example',
          contractShortName: 'example',
          methods: '',
          noSecurityVerfication: true,
          securityDetails: [{
            type: 'Contract Ownerhsip',
            text: 'No verified contract owner',
            verified: false
          },
          {
            type: 'Security Audit',
            text: 'This contract is not audited for security',
            verified: false
          },
          {
            type: 'Method Audit',
            text: 'The functionality of this contract is not confirmed',
            verified: false
          }]
        }
      }))
    }
      getRequestedDetails={getRequestedDetails}
      retrieveEtherBalance={retrieveEtherBalance}
      location={location}
      money={{ether: {amount: 0}}}
      amount={{}}
      ethereumConnect={{}}
      toggleSecuritySection={() => {}}
      executeTransaction={() => {}}
      setFundsNotSufficient={() => {}}
      openConfirmDialog={() => {}} />
    ))
    wrapper.instance()
    expect(getRequestedDetails.called).to.be.true
    expect(retrieveEtherBalance.called).to.be.true
  })

  it('should call executeTransaction with proper params', () => {
    const executeTransaction = stub()
    const wrapper = shallow((<ApprovalRequest.WrappedComponent
      {...ApprovalRequest.mapStateToProps(Immutable.fromJS({
        wallet: {
          money: {
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
          }
        },
        ethereumConnect: {
          loading: false,
          errorMsg: '',
          expanded: false,
          fundsNotSufficient: false,
          requesterName: 'Example',
          contractShortName: 'example',
          methods: '',
          noSecurityVerfication: true,
          securityDetails: [{
            type: 'Contract Ownerhsip',
            text: 'No verified contract owner',
            verified: false
          },
          {
            type: 'Security Audit',
            text: 'This contract is not audited for security',
            verified: false
          },
          {
            type: 'Method Audit',
            text: 'The functionality of this contract is not confirmed',
            verified: false
          }]
        }
      }))}
      getRequestedDetails={() => {}}
      retrieveEtherBalance={() => {}}
      location={location}
      amount={{}}
      ethereumConnect={{}}
      toggleSecuritySection={() => {}}
      setFundsNotSufficient={() => {}}
      openConfirmDialog={() => {}}
      executeTransaction={executeTransaction} />
    ))
    wrapper.instance().executeTransaction({
      contractID: 'test-natascha-contract',
      method: 'setTest',
      'params': 'testing',
      requester: 'http://localhost:5678/joe',
      returnURL: 'https://google.de',
      value: '0.0'
    })
    expect(executeTransaction.called).to.be.true
    expect(executeTransaction.calls).to.deep.equal([{args:
    [{
      contractID: 'test-natascha-contract',
      method: 'setTest',
      'params': ['testing'],
      requester: 'http://localhost:5678/joe',
      returnURL: 'https://google.de',
      value: '0.0'
    }]
    }])
  })
})
