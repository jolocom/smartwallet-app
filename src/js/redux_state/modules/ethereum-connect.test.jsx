import {expect} from 'chai'
import { actions } from './ethereum-connect'
import {stub} from '../../../../test/utils'
const reducer = require('./ethereum-connect').default

describe('# Ethereum Connect ApprovalRequest redux module', () => {
  describe('# Reducer', () => {
    it('should initialize properly', () => {
      const state = reducer(undefined, '@@INIT')
      expect(state.toJS()).to.deep.equal({
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
      })
    })

    it('should update loading, errorMsg on getRequestedDetails', () => { // eslint-disable-line max-len
      const state = reducer(undefined, '@@INIT')
      const action = {
        type: actions.getRequestedDetails.id,
        details: {
          loading: true,
          errorMsg: ''
        }
      }
      const expectedState = {
        loading: true,
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
      expect(reducer(state, action).toJS()).to.deep.equal(expectedState) // eslint-disable-line max-len
    })

    it('should update contractShortName and methods at setContractDetails', () => { // eslint-disable-line max-len
      let state = reducer(undefined, '@@INIT')

      const action = {
        type: actions.setContractDetails.id,
        contract: {
          short_name: 'test contract',
          methods: {
            firstMethod: {description: 'testing contract functionality'}
          }
        }
      }
      state = reducer(state, action)
      expect(state.toJS()).to.deep.equal({
        loading: false,
        errorMsg: '',
        expanded: false,
        fundsNotSufficient: false,
        requesterName: 'Example',
        contractShortName: 'test contract',
        methods: [{
          name: 'firstMethod',
          description: 'testing contract functionality'
        }],
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
      })
    })
  })

  describe('# Actions', () => {
    it('executeTransaction should return TxHash after beeing called', () => {  // eslint-disable-line max-len
      const dispatch = stub()
      const getState = stub()
      const services = {
        auth: {
          currentUser: {
            wallet: {
              userName: 'testNatascha',
              seedPhrase: 'my seed phrase'
            }
          }
        }
      }
      const backend = {gateway: {
        executeEthereumTransaction: stub().returns({txHash: '0xtesttesttest'})
      }}
      const thunk = actions.executeTransaction()
      thunk(dispatch, getState, {backend, services})
      expect(dispatch.called).to.be.true
    })
  })
})
