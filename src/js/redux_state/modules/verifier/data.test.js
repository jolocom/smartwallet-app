import { expect } from 'chai'
import { actions, initialState } from './data'
import reducer from './data'

describe('# verifier data redux module', () => {
  describe('# Reducer', () => {
    it('should initialise properly', () => {
      const state = reducer(undefined, '@@INIT')
      expect(state.toJS()).to.deep.equal(initialState.toJS())
    })
    it('should set the data field value on changeIdCardField', () => {
      const action = {
        type: actions.changeIdCardField.id,
        value: '123',
        field: 'number'
      }
      const state = reducer(initialState, action)
      expect(state.toJS().idCard.number).to.deep.equal({
        value: '123',
        valid: true
      })
    })
    it('should set the state to the initialState on cancel', () => {
      const action = {
        type: actions.cancel.id
      }
      const state = reducer(undefined, action)
      expect(state.toJS()).to.deep.equal(initialState.toJS())
    })
    it('should set showAddress on showPhysicalAddress', () => {
      const action = {
        type: actions.setShowAddress.id,
        value: true
      }
      const {showAddress} = reducer(initialState, action).toJS().idCard
      expect(showAddress).to.be.true
    })
    it('should set physicalAddress attribute on changePhysicalAddressField',
    () => {
      const action = {
        type: actions.changePhysicalAddressField.id,
        field: 'streetWithNumber',
        value: 'test'
      }
      const {streetWithNumber} = reducer(initialState, action)
        .toJS().idCard.physicalAddress
      expect(streetWithNumber).to.deep.equal({
        value: 'test',
        valid: true
      })
    })
  })
})
