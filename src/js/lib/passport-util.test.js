import {expect} from 'chai'
import Immutable from 'immutable'
import {listOfCountries} from './list-of-countries'
import {
  isValidCountry,
  isValidDate,
  isValidGender,
  genderList,
  isValidField,
  setPhysicalAddressField,
  mapBackendToState,
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
  describe('# isValidField', () => {
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
  describe('# checkForNonValidFields', () => {
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
    it('should set showErrors to false if all the field are either alid or empty', () => { // eslint-disable-line max-len
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
  describe('# setPhysicalAddressField ', () => {
    it('should set physical address field to the given value', () => {
      const state = Immutable.fromJS({
        passport: {
          physicalAddress: {
            streetWithNumber: {
              value: '',
              valid: false
            }
          }
        }
      })
      const newState = {
        passport: {
          physicalAddress: {
            streetWithNumber: {
              value: 'test',
              valid: true
            }
          }
        }
      }
      expect(setPhysicalAddressField(state, {
        field: 'streetWithNumber',
        value: 'test'
      }).toJS()).to.deep.equal(newState)
    })
  })
  describe('# changeFieldValue ', () => {
    it('should set passport field to the given value', () => {
      const state = Immutable.fromJS({
        passport: {
          gender: {
            value: '',
            valid: false
          }
        }
      })
      const newState = {
        passport: {
          gender: {
            value: 'male',
            valid: true
          }
        }
      }

      expect(changeFieldValue(state, {
        field: 'gender',
        value: 'male'
      }).toJS()).to.deep.equal(newState)
    })
  })
  describe('# mapBackendToState', () => {
    it('should map the passport information from backend to state', () => {
      const result = {
        locations: [{
          title: 'location',
          streetWithNumber: 'streetName 123',
          zip: '0000',
          city: 'Berlin'
        }],
        number: '123456',
        expirationDate: '02-02-2020',
        firstName: 'Test',
        lastName: 'Test',
        gender: 'male',
        birthDate: '02-02-2000',
        birthPlace: 'Berlin',
        birthCountry: 'Germany',
        physicalAddress: {
          streetWithNumber: 'streetName 1234',
          zip: '0000',
          city: 'Berlin',
          state: 'Berlin',
          country: 'Germany'
        }
      }
      const state = Immutable.fromJS({
        loaded: false,
        showErrors: false,
        focusedGroup: null,
        focusedField: null,
        passport: {
          locations: [{title: '', streetWithNumber: '', zip: '', city: ''}],
          number: {value: '', valid: false},
          expirationDate: {value: '', valid: false},
          firstName: {value: '', valid: false},
          lastName: {value: '', valid: false},
          gender: {value: '', valid: false, options: genderList},
          birthDate: {value: '', valid: false},
          birthPlace: {value: '', valid: false},
          birthCountry: {value: '', valid: false, options: listOfCountries},
          showAddress: false,
          physicalAddress: {
            streetWithNumber: {value: '', valid: false},
            zip: {value: '', valid: false},
            city: {value: '', valid: false},
            state: {value: '', valid: false},
            country: {value: '', valid: false, options: listOfCountries}
          }
        }
      })
      const expectedState = {
        loaded: true,
        showErrors: false,
        focusedGroup: null,
        focusedField: null,
        passport: {
          locations: [{
            title: 'location',
            streetWithNumber: 'streetName 123',
            zip: '0000',
            city: 'Berlin'
          }],
          number: {value: '123456', valid: true},
          expirationDate: {value: '02-02-2020', valid: true},
          firstName: {value: 'Test', valid: true},
          lastName: {value: 'Test', valid: true},
          gender: {value: 'male', valid: true, options: genderList},
          birthDate: {value: '02-02-2000', valid: true},
          birthPlace: {value: 'Berlin', valid: true},
          birthCountry: {
            value: 'Germany',
            valid: true,
            options: listOfCountries
          },
          showAddress: false,
          physicalAddress: {
            streetWithNumber: {value: 'streetName 1234', valid: true},
            zip: {value: '0000', valid: true},
            city: {value: 'Berlin', valid: true},
            state: {value: 'Berlin', valid: true},
            country: {value: 'Germany', valid: true, options: listOfCountries}
          }
        }
      }

      expect(mapBackendToState(state, {result}).toJS())
        .to.deep.equal(expectedState)
    })
  })
})
