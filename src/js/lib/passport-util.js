import {listOfCountries} from './list-of-countries'

export const genderList = ['male', 'female']

export const isValidCountry = value => listOfCountries.includes(value)

export const isValidDate = value => !!Date.parse(value)

export const isValidGender = value => genderList.includes(value)

export const isValidField = ({field, value}) => {
  switch (field) {
    case 'expirationDate':
    case 'birthDate':
      return isValidDate(value)
    case 'gender':
      return isValidGender(value)
    case 'country':
    case 'birthCountry':
      return isValidCountry(value)
    default:
      return value.length > 0
  }
}

export const setPhysicalAddressField = (state, {field, value}) => state.mergeIn(
  ['passport', 'physicalAddress', field], {
    value,
    valid: isValidField({field, value})
  })

export const changeFieldValue = (state, {field, value}) => state.mergeIn(
  ['passport', field], {
    value,
    valid: isValidField({field, value})
  })

export const checkForNonValidFields = (reduxState) => {
  const {
    locations,
    number,
    expirationDate,
    firstName,
    lastName,
    gender,
    birthDate,
    birthPlace,
    birthCountry
  } = reduxState.toJS().passport
  const {streetWithNumber, zip, city, state, country} = reduxState
    .toJS().passport.physicalAddress
  const fields = [
    locations, number, expirationDate, firstName, lastName, gender, birthDate,
    birthPlace, birthCountry, streetWithNumber, zip, city, state, country
  ]
  const showErrors = !fields.every(({value, valid}) => valid || value === '')
  return reduxState.merge({showErrors})
}

export const submitChanges = ({backend, services, passport, webId}) => {
  const operations = {
    set: () => {},
    update: () => {},
    remove: () => {}
  }
  operations.set()
  return Promise((resolve, reject) => {
    resolve(true)
  })
}
