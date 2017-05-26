/* eslint-disable */
import {expect} from 'chai'
import Immutable from 'immutable'
import {stub} from '../../../test/utils'
import {listOfCountries} from './list-of-countries'
import {
  isValidCountry,
  isValidDate,
  isValidGender,
  genderList,
  isValidField,
  setPhysicalAddressField,
  changeFieldValue,
  checkForNonValidFields
} from './passport-util'

describe('# Passport util', () => {
  describe('# isValidCountry', () => {
    it('should return true if the country is valid', () => {
      listOfCountries.map(country => {
        expect(isValidCountry(country)).to.be.true
      })
    })
    it('should return false if the value is not on the list of countries', () => { // eslint-disable-line max-len
      expect(isValidCountry('non valid coutnry')).to.be.false
    })
  })
  describe('# isValidDate', () => {
    it('should return true if the date is valid', () => {
      expect(isValidDate('2017-05-02')).to.be.true
    })
    it('should return false when a non valid date is given', () => {
      expect(isValidDate('non valid date')).to.be.false
    })
  })
  describe('# isValidGender', () => {
    it('should return true if value is in the gender list', () => {
      genderList.map(gender => { expect(isValidGender(gender)).to.be.true })
    })
    it('should return false if value is not in the gender list', () => {
      expect(isValidGender('non valid value')).to.be.false
    })
  })
  describe.only('# isValidField', () => {
    it('should return true if last name is non empty string', () => {
      expect(isValidField({field: 'lastName', value: 'test'})).to.be.true
    })
    it('should return true if first name is non empty string', () => {
      expect(isValidField({field: 'firstName', value: 'test'})).to.be.true
    })
    it('should return true if birth date is valid', () => {
      expect(isValidField({field: 'birthDate', value: '2010-02-02'})).to.be.true
    })
    it('should return true if birth country is valid', () => {
      expect(isValidField({field: 'birthCountry', value: 'France'})).to.be.true
    })
  })
  describe.only('# checkForNonValidFields', () => {
    it('should set showErrors to true if a field is not valid or empty', () => {
      const validField = {valid: true, value: 'test'}
      const nonValidField = {valid: false, value: 'test'}
      const state = Immutable.fromJS({
        showErrors: false,
        passport: {
          locations: validField,
          number: validField,
          expirationDate: validField,
          firstName: validField,
          lastName: validField,
          gender: validField,
          birthDate: validField,
          birthPlace: validField,
          birthCountry: validField,
          physicalAddress: {
            streetWithNumber: nonValidField,
            zip: validField,
            city: validField,
            state: validField,
            country: validField
          }
        }
      })
      expect(checkForNonValidFields(state).toJS().showErrors).to.be.true
    })
    it('should set showErrors to false if all the field are either alid or empty', () => {
      const validField = {valid: true, value: 'test'}
      const state = Immutable.fromJS({
        showErrors: false,
        passport: {
          locations: validField,
          number: validField,
          expirationDate: validField,
          firstName: validField,
          lastName: validField,
          gender: validField,
          birthDate: validField,
          birthPlace: validField,
          birthCountry: validField,
          physicalAddress: {
            streetWithNumber: validField,
            zip: validField,
            city: validField,
            state: validField,
            country: validField
          }
        }
      })
      expect(checkForNonValidFields(state).toJS().showErrors).to.be.false
    })
  })
})
