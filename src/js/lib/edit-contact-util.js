import Immutable from 'immutable'

export const validateChanges = (state) => {
  const {newInformation, originalInformation} = state.get('information').toJS()
  const newFields = newInformation.emails.concat(newInformation.phoneNumbers)
  const oldFields = originalInformation.emails.concat(
    originalInformation.phoneNumbers)

  const isValid = newFields.every(e => (e.blank || e.valid || e.delete)) &&
    oldFields.every(e => e.delete || !e.update || (e.valid && !e.verified))

  return state.setIn(['showErrors'], !isValid)
}

const isBlank = (value, field) => {
  if (typeof value === 'object') {
    return !value.value || !value.value.trim()
  }
  return !value.trim()
}

const isValidValue = (value, field) => {
  switch (field) {
    case 'phoneNumbers':
      return (/^([\d.]+)/.test(value.value) ||
        /^\+([\d]+)$/.test(value.value))
    case 'emails':
      return /^([\w.]+)@([\w.]+)\.(\w+)/.test(value)
    default:
      return true
  }
}

const parseActionValueToObject = (value, field) => field === 'phoneNumbers'
  ? value : {value}

const addTypeAttribute = (field) => field === 'phoneNumbers'
  ? {type: 'personal'} : {}

export const setNewFieldValue = (state, {field, index, value}) => state.mergeIn(
  ['information', 'newInformation', field, index], {
    ...parseActionValueToObject(value, field),
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

const canAddNewField = (state, field, index) => {
  if (index === 0) { return true }
  if (!state.getIn(
    ['information', 'newInformation', field, index - 1, 'delete'])) {
    return !state.getIn(
      ['information', 'newInformation', field, index - 1, 'blank'])
  }
  return canAddNewField(state, field, index - 1)
}

export const addNewField = (state, {field, index}) => {
  if (canAddNewField(state, field, index)) {
    return state.mergeIn(['information', 'newInformation', field, index], {
      ...addTypeAttribute(field), value: '', verified: false, valid: false,
      delete: false, blank: true
    })
  }
  return state
}

const canUpdate = (state, field, index) => !state.getIn(
  ['information', 'originalInformation', field, index, 'verified']) &&
  state.getIn(['information', 'originalInformation', field]).toJS().length > 0

export const updateOriginalValue = (state, {field, value, index}) => {
  if (canUpdate(state, field, index)) {
    return state.mergeIn(['information', 'originalInformation', field, index], {
      ...parseActionValueToObject(value, field),
      valid: isValidValue(value, field),
      delete: value === '',
      update: true
    })
  }
  return state
}
const collectChages = (state, {remove, update, set}, key) => [].concat(
    state.originalInformation[key].map(
      e => e.delete ? remove(e.value)
      : (e.update && e.valid && !e.verified) ? update(e.value)
      : null
    ), state.newInformation[key].map(
      e => (e.delete || e.blank || !e.valid) ? null : set(e.value)
  ))

export const submitChanges = (backend, services, state) => {
  const emailOperations = {
    set: services.auth.currentUser.wallet.setEmail,
    remove: services.auth.currentUser.wallet.deleteEmail,
    update: services.auth.currentUser.wallet.updateEmail
  }
  const phoneOperations = {
    set: services.auth.currentUser.wallet.setPhone,
    remove: services.auth.currentUser.wallet.deletePhone,
    update: services.auth.currentUser.wallet.updatePhone
  }

  let promises = [].concat(collectChages(state, emailOperations, 'emails'),
    collectChages(state, phoneOperations, 'phoneNumbers'))
  return Promise.all(promises)
}
