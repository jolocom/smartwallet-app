import {expect} from 'chai'
import * as identity from './identity'
// import * as router from '../router'
import {stub, withStubs} from '../../../../../test/utils'
const reducer = require('./identity').default

describe('# Wallet identity redux module', () => {
  describe('# Reducer', () => {
    it('should initialise properly', () => {
      const state = reducer(undefined, '@@INIT')
      expect(state.toJS()).to.deep.equal({
        loaded: false,
        webId: '',
        username: {verified: false, value: ''},
        contact: {
          phone: [{type: '', value: '', verified: false}],
          email: [{type: '', value: '', verified: false}]
        },
        passport: {
          number: '', givenName: '', familyName: '', birthDate: '',
          gender: '', showAddress: '', streetAndNumber: '', city: '',
          zip: '', state: '', country: '', verified: false
        }
      })
    })

    it('should get the user\'s information on getIdentityInformation', () => {
      let state = reducer(undefined, '@@INIT')
      const action = {
        type: identity.actions.getIdentityInformation.id_success,
        result: {
          status: 'succeeded'
        }
      }
      state = reducer(state, action)
      expect(state.toJS())
        .to.deep.equal({
          loaded: true,
          status: 'succeeded'
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
    it('getIdentityInformation should get the identity information from ' +
      'the backend', () => {
      const getState = stub()
      const services = {
        auth: {
          currentUser: {
            wallet: {
              getUserInformation: stub().returns('information')
            }
          }
        }
      }
      const dispatch = stub()
      const thunk = identity.actions.getIdentityInformation()
      withStubs([
        [services.auth.currentUser.wallet, 'getUserInformation', {
          returns: 'information'
        }]
      ], () => {
        thunk(dispatch, getState, {services})
        expect(dispatch.calledWithArgs[0].promise())
          .to.deep.equal('information')
      })
      withStubs([
        [identity.actions.getIdentityInformation, 'buildAction', {
          returns: 'build'
        }]
      ], () => {
        thunk(dispatch, getState, {services})
        expect(dispatch.calledWithArgs[0]).to.deep.equal('build')
      })
    })
  })
})
