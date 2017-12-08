import {expect} from 'chai'
import { actions } from './identity'
import {stub} from '../../../../../test/utils'
import reducer from './identity'

describe('# Wallet identity redux module', () => {
  describe('# Reducer', () => {
    it('should initialise properly', () => {
      const state = reducer(undefined, '@@INIT')
      expect(state.toJS()).to.deep.equal({
        error: false,
        loaded: false,
        webId: '',
        expandedFields: {
          contact: false,
          ethereum: false,
          idCards: false,
          passports: false
        },
        displayName: {
          edit: false,
          value: ''
        },
        ethereum: {
          walletAddress: '',
          amount: '',
          identityAddress: ''
        },
        username: {verified: false, value: ''},
        contact: {
          phones: [{
            type: '', number: '', pin: '', verified: false, smsCode: '',
            pinFocused: false, codeIsSent: false
          }],
          emails: [{type: '', address: '', pin: '', verified: false}]
        },
        passports: [{
          number: '', givenName: '', familyName: '', birthDate: '',
          gender: '', showAddress: '', streetAndNumber: '', city: '',
          zip: '', state: '', country: '', verified: false
        }]
      })
    })

    it('should get the user\'s information on getIdentityInformation', () => {
      let state = reducer(undefined, '@@INIT')
      const action = {
        type: actions.getIdentityInformation.id_success,
        result: {
          webId: 'https://test.webid.jolocom.com',
          userName: 'test',
          displayName: {edit: false, value: 'testMe'},
          contact: {email: [{address: 'test'}], phone: [{number: 'test'}]},
          passports: ['test'],
          idCards: ['test'],
          ethereum: {walletAddress: 'test',
            identityAddress: 'test', amount: '0'}
        }
      }
      state = reducer(state, action)
      expect(state.toJS())
        .to.deep.equal({
          error: false,
          loaded: true,
          webId: 'https://test.webid.jolocom.com',
          ethereum: {
            walletAddress: 'test',
            amount: '0',
            identityAddress: 'test'
          },
          expandedFields: {
            ethereum: false,
            contact: false,
            idCards: false,
            passports: false
          },
          username: {value: 'test'},
          displayName: {
            edit: false,
            value: 'testMe'
          },
          contact: {emails: [{address: 'test'}], phones: [{number: 'test'}]},
          passports: ['test'],
          idCards: ['test']
        })
    })
  })

  describe('# actions ', () => {
    it('goTo should redirect the user to the correct screen',
      () => {
        const dispatch = stub()
        const thunk = actions.goTo('contact')
        thunk(dispatch)
        expect(dispatch.called).to.be.true
        expect(dispatch.calls).to.deep.equal([{
          args: [{
            payload: {
              args: ['/wallet/identity/contact'],
              method: 'push'
            },
            type: '@@router/CALL_HISTORY_METHOD'
          }]
        }])
      }
    )
    it('getIdentityInformation should retrieve identity information', () => {
      const getState = stub()
      const services = {auth: {
        currentUser: {
          wallet: {
            getUserInformation: stub().returns('information')
          }
        }
      }}
      const dispatch = stub()
      const thunk = actions.getIdentityInformation()
      thunk(dispatch, getState, {services})
      expect(dispatch.called).to.be.true
    })
  })
})
