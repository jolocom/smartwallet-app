import { expect } from 'chai'
import reducer from './id-card'
import { initialState, actions } from './id-card'

describe('# IdCard redux module', () => {
  describe('# Reducer', () => {
    it('should initialise properly', () => {
      const state = reducer(undefined, '@@INIT')
      expect(state.toJS()).to.deep.equal(initialState.toJS())
    })
    it('should set the idCard field value on changeIdCardField', () => {
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
    it('should set loaded to false on save', () => {
      const action = {
        type: actions.save.id
      }
      expect(reducer(initialState, action).toJS().loaded).to.be.false
      expect(reducer(initialState, action).toJS().showErrors).to.be.false
    })
    it('should set loaded and showErrors to true if save fails', () => {
      const action = {
        type: actions.save.id_fail
      }
      expect(reducer(initialState, action).toJS().showErrors).to.be.true
      expect(reducer(initialState, action).toJS().loaded).to.be.true
    })
    it('should set loaded and showErrors on save success', () => {
      const action = {
        type: actions.save.id_success
      }
      expect(reducer(initialState, action).toJS().loaded).to.be.true
      expect(reducer(initialState, action).toJS().showErrors).to.be.false
    })
    it('should set loaded to false on retrieveIdCardInformation', () => {
      const action = {
        type: actions.retrieveIdCardInformation.id
      }
      expect(reducer(initialState, action).toJS().loaded).to.be.false
    })
    it('should set loaded and showErrors to true on retrieveIdCardInformation fails', () => { // eslint-disable-line max-len
      const action = {
        type: actions.retrieveIdCardInformation.id_fail
      }
      const state = reducer(initialState, action).toJS()
      expect(state.loaded).to.be.true
      expect(state.showErrors).to.be.true
    })
    it('should set loaded to true and showErrors to false on retrieveIdCardInformation success', () => { // eslint-disable-line max-len
      const action = {
        type: actions.retrieveIdCardInformation.id_success,
        result: {
          locations: '', number: '', expirationDate: '', firstName: '',
          lastName: '', gender: '', birthDate: '', birthPlace: '',
          birthCountry: '',
          physicalAddress: {
            streetWithNumber: '', zip: '', city: '', state: '', country: ''
          }
        }
      }
      const state = reducer(initialState, action).toJS()
      expect(state.loaded).to.be.true
      expect(state.showErrors).to.be.false
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
  describe('# Actions', () => {
    describe('# showPhysicalAddress', () => {
      it('should return the expected params when called properly', () => {
        const setShowAddress = actions.setShowAddress(true)
        expect(setShowAddress).to.deep.equal({
          type: actions.setShowAddress.id,
          value: true
        })
      })
    })
    describe('# changeIdCardField', () => {
      it('should return the expected params when called properly', () => {
        const changeIdCardField = actions.changeIdCardField('number',
        'test')
        expect(changeIdCardField).to.deep.equal({
          type: actions.changeIdCardField.id,
          value: 'test',
          field: 'number'
        })
      })
    })
    describe('# changePhysicalAddressField', () => {
      it('should return the expected params when called properly', () => {
        const changePhysicalAddressField = actions.changePhysicalAddressField({
          field: 'streetWithNumber',
          value: 'test'
        })
        expect(changePhysicalAddressField).to.deep.equal({
          type: actions.changePhysicalAddressField.id,
          value: 'test',
          field: 'streetWithNumber'
        })
      })
    })
  })
})
