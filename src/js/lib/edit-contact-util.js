import Immutable from 'immutable'

export const validateChanges = (state) => {
  const {newInformation, originalInformation} = state.get('information').toJS()
  const newFields = newInformation.emails.concat(newInformation.phoneNumbers)
  const oldValues = originalInformation.emails.concat(
    originalInformation.phoneNumbers)
  const isValid = newFields.every(e => e.blank || e.valid || e.delete) &&
    oldValues.every(e => e.valid || e.delete || (e.update && !e.verified))

  return state.setIn(['showErrors'], !isValid)
}

const isBlank = (value, field) => field === 'phoneNumbers'
  ? value.value === '' : value === ''

const isValidValue = (value, field) => field === 'phoneNumbers'
  ? /^[+0-9]([\d]+)$/.test(value.value)
  : /^([\w.]+)@([\w.]+)\.(\w+)/.test(value)

const parseValueToObject = (value, field) => field === 'phoneNumbers'
  ? value : {value}

const addTypeAttribute = (field) => field === 'phoneNumbers'
  ? {type: 'home'} : {}

export const setNewFieldValue = (state, {field, index, value}) => state.mergeIn(
  ['information', 'newInformation', field, index], {
    ...parseValueToObject(value, field),
    valid: isValidValue(value, field),
    blank: isBlank(value, field)
  })

export const mapAccountInformationToState = ({emails, phoneNumbers}) =>
  Immutable.fromJS({
    loading: false,
    showErrors: false,
    information: {
      newInformation: {
        emails: [],
        phoneNumbers: []
      },
      originalInformation: {
        emails: emails.map(email => {
          return {...email, delete: false, update: false, valid: true}
        }),
        phoneNumbers: phoneNumbers.map(phone => {
          return {...phone, delete: false, update: false, valid: true}
        })
      }
    }
  })

export const addNewField = (state, {field, index}) => state.mergeIn(
  ['information', 'newInformation', field, index], {
    ...addTypeAttribute(field),
    value: '',
    verified: false,
    valid: false,
    delete: false,
    blank: true
  })

const canUpdate = (state, field, index) => !state.getIn(
  ['information', 'originalInformation', field, index, 'verified']) &&
  state.getIn(['information', 'originalInformation', field]).toJS().length > 0

export const updateOriginalValue = (state, {field, value, index}) =>
  canUpdate(state, field, index) === false ? state : state.mergeIn(
    ['information', 'originalInformation', field, index], {
      ...parseValueToObject(value, field),
      valid: isValidValue(value, field),
      delete: value === '',
      update: true
    })

const save = (state, {remove, update, setNewFieldValue}, key) => [].concat(
  state.originalInformation[key].map(e => e.delete ? remove(e.value)
    : (e.update && e.valid && !e.verified) ? update(e.value) : null),
  state.newInformation[key].map(e => (e.delete || e.blank || !e.valid)
    ? null : setNewFieldValue(e.value)
  ))

export const submitChanges = (backend, services, state) => {
  const emailOperations = {
    setNewFieldValue: services.auth.currentUser.wallet.setEmail,
    remove: services.auth.currentUser.wallet.deleteEmail,
    update: services.auth.currentUser.wallet.updateEmail
  }
  const phoneOperations = {
    setNewFieldValue: services.auth.currentUser.wallet.setPhone,
    remove: services.auth.currentUser.wallet.deletePhone,
    update: services.auth.currentUser.wallet.updatePhone
  }
  var promises = []
  promises = save(state, emailOperations, 'emails')
  promises = promises.concat(save(state, phoneOperations, 'phoneNumbers'))
  return Promise.all(promises)
}
