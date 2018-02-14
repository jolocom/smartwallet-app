import {expect} from 'chai'
// eslint-disable-next-line
import { actions } from './identity-new'
import { stub } from '../../../../../test/utils'
// eslint-disable-next-line
import reducer from './identity-new'
import Immutable from 'immutable'
describe('Wallet identity-new redux module', () => {
  describe('Reducer', () => {
    it('should get user\'s infromation on retrieveAttributes', () => {
      let state = reducer(undefined, '@@INIT')
      const selfSignedClaim = {
        credential: {
          '@context': 'https://w3id.org/credentials/v1',
          claim: {id: 'did:jolo:TEST', email: 'nat@mail.de'},
          id: '7TESTa75cffba',
          issued: 'Tue Feb 13 2018 12:21:15 GMT+0100 (Mitteleuropäische Zeit)',
          issuer: 'did:jolo:TEST',
          type: 'email',
          signature: 'TESTcc16ef169079deeb2ed46080ebfb73e'
        }
      }

      const action = {
        type: actions.retrieveAttributes.id_success,
        claims: ['phone', 'name', 'email'],
        result: [null, null, selfSignedClaim]
      }

      state = reducer(state, action)
      expect(state.toJS()).to.deep.equal({
        toggleEdit: {
          field: '',
          bool: false
        },
        userData: {
          phone: '',
          name: '',
          email: 'nat@mail.de'
        },
        qrscan: false,
        errorMsg: ''
      })
    })

    it('enterField should update correct state based on field name', () => {
      let state = reducer(undefined, '@@INIT')
      const action = {
        type: actions.enterField.id,
        field: 'name',
        value: 'Natascha'
      }

      state = reducer(state, action)
      const expectedState = {
        toggleEdit: {
          field: '',
          bool: false
        },
        userData: {
          phone: '',
          name: 'Natascha',
          email: ''
        },
        qrscan: false,
        errorMsg: ''
      }
      expect(state.toJS()).to.deep.equal(expectedState)
    })

    it('toggleEditField should toggle the right field', () => {
      let state = reducer(undefined, '@@INIT')
      const action = {
        type: actions.toggleEditField.id,
        field: 'name',
        value: 'false'
      }

      state = reducer(state, action)
      const expectedState = {
        toggleEdit: {
          field: 'name',
          bool: false
        },
        userData: {
          phone: '',
          name: '',
          email: ''
        },
        qrscan: false,
        errorMsg: ''
      }
      expect(state.toJS()).to.deep.equal(expectedState)
    })
  })

  describe('Actions', () => (
    it('should save attribute on saveAttribute', async () => {
      const dispatch = stub()
      const getState = () => Immutable.fromJS({
        wallet: {
          identityNew: {
            userData: {name: 'Natascha'},
            toggleEdit: {field: 'name', bool: true}
          }
        }
      })
      const services = {
        storage: { setItem: stub().returns('Natascha') }
      }

      const thunk = actions.saveAttribute({field: 'name'})
      thunk(dispatch, getState, {services})
      // eslint-disable-next-line
      expect(dispatch.called).to.be.true
      // expect(services.storage.getItem.calls).to.be.true
    })
  ))
})
