import {expect} from 'chai'
import * as identity from './identity'
// import * as router from '../router'
import {stub} from '../../../../../test/utils'
const reducer = require('./identity').default

describe('# Wallet identity redux module', () => {
  describe('# Reducer', () => {
    it('should initialise properly', () => {
      const state = reducer(undefined, '@@INIT')
      expect(state.toJS()).to.deep.equal({
        error: false,
        loaded: false,
        webId: '',
        username: {verified: false, value: ''},
        contact: {
          phones: [{type: '', number: '', verified: false}],
          emails: [{type: '', address: '', verified: false}]
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
        type: identity.actions.getIdentityInformation.id_success,
        result: {
          webId: 'test',
          username: 'test',
          contact: {email: [{address: 'test'}], phone: [{number: 'test'}]},
          passports: ['test'],
          idCards: ['test']
        }
      }
      state = reducer(state, action)
      expect(state.toJS())
        .to.deep.equal({
          error: false,
          loaded: true,
          webId: 'test',
          username: 'test',
          contact: {emails: [{address: 'test'}], phones: [{number: 'test'}]},
          passports: ['test'],
          idCards: ['test']
        })
    })
  })

  describe('# actions ', () => {
    it('goToDrivingLicenceManagement should redirect the user to drivering ' +
    'licence management', () => {
      const dispatch = stub()
      const action = identity.actions.goToDrivingLicenceManagement()
      action(dispatch)
      expect(dispatch.called).to.be.true
      expect(dispatch.calls).to.deep.equal([{
        args: [{
          payload: {
            args: ['/wallet/identity/drivers-licence/add'],
            method: 'push'
          },
          type: '@@router/CALL_HISTORY_METHOD'
        }]
      }])
    })
    it('goToPassportManagement should redirect the user to passport management',
      () => {
        const dispatch = stub()
        const thunk = identity.actions.goToPassportManagement()
        thunk(dispatch)
        expect(dispatch.called).to.be.true
        expect(dispatch.calls).to.deep.equal([{
          args: [{
            payload: {
              args: ['/wallet/identity/passport/add'],
              method: 'push'
            },
            type: '@@router/CALL_HISTORY_METHOD'
          }]
        }])
      }
    )
    it('goToContactManagement should redirect the user to contact management',
      () => {
        const dispatch = stub()
        const thunk = identity.actions.goToContactManagement()
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
    it('goToIdentity should redirect the user to the wallet Identity Tab',
      () => {
        const dispatch = stub()
        const thunk = identity.actions.goToIdentity()
        thunk(dispatch)
        expect(dispatch.called).to.be.true
        expect(dispatch.calls).to.deep.equal([{
          args: [{
            payload: {
              args: ['/wallet/identity/'],
              method: 'push'
            },
            type: '@@router/CALL_HISTORY_METHOD'
          }]
        }])
      }
    )
    it('getIdentityInformation should get the identity information from ' +
      'the backend', () => {
      const getState = stub()
      const backend = {solid: {
        getUserInformation: stub().returns('information')
      }}
      const dispatch = stub()
      const thunk = identity.actions.getIdentityInformation()

      thunk(dispatch, getState, {stub, backend})

      expect(dispatch.called).to.be.true
      expect(dispatch.calls[0].args[0].promise()).to.equal('information')
      expect(dispatch.calls[0].args[0].types).to.deep.equal([
        'little-sister/wallet/identity/GET_IDENTITY_INFORMATION',
        'little-sister/wallet/identity/GET_IDENTITY_INFORMATION_SUCCESS',
        'little-sister/wallet/identity/GET_IDENTITY_INFORMATION_FAIL'
      ])
      const backendCall = backend.solid.getUserInformation
      expect(backendCall.called).to.be.true
    })
  })
})
