import Immutable from 'immutable'

export const validateChanges = (state) => {
  const {newInformation, originalInformation: original} = state
    .get('information').toJS()
  const newFields = [...newInformation.emails, ...newInformation.phones]
  const oldFields = [...original.emails, ...original.phones]

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
    case 'phones':
      return (/^([\d.]+)$/.test(value.value) ||
        /^\+([\d]+)$/.test(value.value))
    case 'emails':
      return /^([\w.]+)@([\w.]+)\.(\w+)/.test(value)
    default:
      return false
  }
}

const parseActionValueToObject = (value, field) => field === 'phones'
  ? value : {value}

const addTypeAttribute = (field) => field === 'phones'
  ? {type: 'personal'} : {}

export const setNewFieldValue = (state, {field, index, value}) => state.mergeIn(
  ['information', 'newInformation', field, index], {
    ...parseActionValueToObject(value, field),
    valid: isValidValue(value, field),
    blank: isBlank(value, field)
  })

export const mapAccountInformationToState = ({email, phone, addresses = []}) =>
  Immutable.fromJS({
    loading: false,
    showErrors: false,
    information: {
      newInformation: {
        emails: [email.length > 0 ? {delete: true} : {
          value: '',
          delete: false,
          blank: true,
          valid: true
        }],
        phones: [phone.length > 0 ? {delete: true} : {
          value: '',
          type: 'personal',
          blank: true,
          delete: false,
          valid: true
        }],
        addresses: [addresses.length > 0 ? {delete: true} : {
          streetWithNumber: {value: '', valid: true},
          zip: {value: '', valid: true},
          city: {value: '', valid: true},
          state: {value: '', valid: true},
          country: {value: '', valid: true},
          delete: false,
          blank: true,
          valid: true
        }]
      },
      originalInformation: {
        emails: email.map(({address, verified, id}) => ({
          value: address,
          verified,
          id,
          delete: false,
          update: false,
          valid: true
        })),
        phones: phone.map(({number, verified, id}) => ({
          value: number,
          // TODO: phone type needs to be delivered from the backend
          type: 'personal',
          verified,
          id,
          delete: false,
          update: false,
          valid: true
        })),
        addresses: addresses.map(({streetWithNumber, zip, city, state, country}) => ({ // eslint-disable-line max-len
          streetWithNumber: {...streetWithNumber, valid: true},
          zip: {...zip, valid: true},
          city: {...city, valid: true},
          state: {...state, valid: true},
          country: {...country, valid: true},
          delete: false,
          blank: true,
          valid: true
        }))
      }
    }
  })

const canAddNewField = (state, field, index) => {
  if (index === 0) { return true }
  if (!state
    .getIn(['information', 'newInformation', field, index - 1, 'delete'])) {
    return !state
      .getIn(['information', 'newInformation', field, index - 1, 'blank'])
  }
  return canAddNewField(state, field, index - 1)
}

export const addNewField = (state, {field, index}) => {
  if (field === 'addresses') {
    return state.mergeIn(['information', 'newInformation', field, index], {
      streetWithNumber: {value: '', valid: true},
      zip: {value: '', valid: true},
      city: {value: '', valid: true},
      state: {value: '', valid: true},
      country: {value: '', valid: true},
      delete: false,
      blank: true,
      valid: true
    })
  }
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
const collectChages =
  (state, {remove, update, set}, key, webId, attributeType) => [].concat(
    state.originalInformation[key].map(
      e => e.delete ? remove(webId, attributeType, e.id)
      : (e.update && e.valid && !e.verified)
      ? update(webId, attributeType, e.id, e.value)
      : null
    ), state.newInformation[key].map(
      e => (e.delete || e.blank || !e.valid)
      ? null : set(webId, e.value)
  ))

export const submitChanges = (backend, services, state, webId) => {
  let solidAgent = backend.solid
  const emailOperations = {
    set: solidAgent.setEmail.bind(solidAgent),
    remove: solidAgent.deleteEntry.bind(solidAgent),
    update: solidAgent.updateEntry.bind(solidAgent)
  }
  const phoneOperations = {
    set: solidAgent.setPhone.bind(solidAgent),
    remove: solidAgent.deleteEntry.bind(solidAgent),
    update: solidAgent.updateEntry.bind(solidAgent)
  }
  let promises = [].concat(
    collectChages(state, emailOperations, 'emails', webId, 'email'),
    collectChages(state, phoneOperations, 'phones', webId, 'phone'))
  return Promise.all(promises)
}
