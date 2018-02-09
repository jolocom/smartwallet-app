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
      const action = {
        type: actions.retrieveAttributes.id_success,
        claims: ['phone', 'name', 'email'],
        result: ['111', 'Natascha', 'b@b.com']
      }

      state = reducer(state, action)
      expect(state.toJS()).to.deep.equal({
        toggleEdit: {
          field: '',
          bool: false
        },
        userData: {
          phone: '111',
          name: 'Natascha',
          email: 'b@b.com'
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
