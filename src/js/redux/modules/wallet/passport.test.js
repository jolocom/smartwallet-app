import {expect} from 'chai'
const reducer = require('./passport').default
import * as actions from './passport'

describe('# Passport redux module', () => {
  describe('# Reducer', () => {
    let {initialState} = actions
    it('should initialise properly', () => {
      const state = reducer(undefined, '@@INIT')
      expect(state.toJS()).to.deep.equal(initialState.toJS())
    })
    it('should set the passport field value on changePassportField', () => {
      const action = {
        type: actions.changePassportField.id,
        value: '123',
        field: 'number'
      }
      const state = reducer(initialState, action)
      expect(state.toJS().passport.number).to.deep.equal({
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
    it('should set loaded to false on retrievePassportInformation', () => {
      const action = {
        type: actions.retrievePassportInformation.id
      }
      expect(reducer(initialState, action).toJS().loaded).to.be.false
    })
    it('should set loaded and showErrors to true on ' +
    'retrievePassportInformation fails', () => {
      const action = {
        type: actions.retrievePassportInformation.id_fail
      }
      const state = reducer(initialState, action).toJS()
      expect(state.loaded).to.be.true
      expect(state.showErrors).to.be.true
    })
    it('should set loaded to true and showErrors to false on ' +
    'retrievePassportInformation success', () => {
      const action = {
        type: actions.retrievePassportInformation.id_success
      }
      const state = reducer(initialState, action).toJS()
      expect(state.loaded).to.be.true
      expect(state.showErrors).to.be.false
    })
    it('should set showAddress to !showAddress on showPhysicalAddress', () => {
      const action = {
        type: actions.showPhysicalAddress.id
      }
      const {showAddress} = reducer(initialState, action).toJS().passport
      expect(showAddress)
        .to.equal(!initialState.toJS().passport.showAddress)
    })
    it('should set physicalAddress attribute on changePhysicalAddressField',
    () => {
      const action = {
        type: actions.changePhysicalAddressField.id,
        field: 'streetWithNumber',
        value: 'test'
      }
      const {streetWithNumber} = reducer(initialState, action)
        .toJS().passport.physicalAddress
      expect(streetWithNumber).to.deep.equal({
        value: 'test',
        valid: true
      })
    })
  })
  describe('# Actions', () => {
    describe('# showPhysicalAddress', () => {
      it('should return the expected params when called properly', () => {
        const showPhysicalAddress = actions.showPhysicalAddress(true)
        expect(showPhysicalAddress).to.deep.equal({
          type: actions.showPhysicalAddress.id,
          value: true
        })
      })
    })
    describe('# changePassportField', () => {
      it('should return the expected params when called properly', () => {
        const changePassportField = actions.changePassportField('number',
        'test')
        expect(changePassportField).to.deep.equal({
          type: actions.changePassportField.id,
          value: 'test',
          field: 'number'
        })
      })
    })
    describe('# changePhysicalAddressField', () => {
      it('should return the expected params when called properly', () => {
        const changePhysicalAddressField = actions
        .changePhysicalAddressField('number', 'test')
        expect(changePhysicalAddressField).to.deep.equal({
          type: actions.changePhysicalAddressField.id,
          value: 'test',
          field: 'streetWithNumber'
        })
      })
    })
  })
})
