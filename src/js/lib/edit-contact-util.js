import Immutable from 'immutable'

export const validateChanges = (state) => {
  const {newInformation, originalInformation} = state.get('information').toJS()
  const newFields = newInformation.email.concat(newInformation.phone)
  const oldFields = originalInformation.email.concat(
    originalInformation.phone)

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
    case 'phone':
      return (/^([\d.]+)$/.test(value.value) ||
        /^\+([\d]+)$/.test(value.value))
    case 'email':
      return /^([\w.]+)@([\w.]+)\.(\w+)/.test(value)
    default:
      return false
  }
}

const parseActionValueToObject = (value, field) => field === 'phone'
  ? value : {value}

const addTypeAttribute = (field) => field === 'phone'
  ? {type: 'personal'} : {}

export const setNewFieldValue = (state, {field, index, value}) => state.mergeIn(
  ['information', 'newInformation', field, index], {
    ...parseActionValueToObject(value, field),
    valid: isValidValue(value, field),
    blank: isBlank(value, field)
  })

export const mapAccountInformationToState = ({email, phone}) =>
  Immutable.fromJS({
    loading: false,
    showErrors: false,
    information: {
      newInformation: {
        email: [],
        phone: []
      },
      originalInformation: {
        email: email.map(element => {
          return {value: element.address,
            verified: element.verified,
            id: element.id, delete: false,
            update: false,
            valid: true}
        }),
        phone: phone.map(element => {
          return {value: element.number,
            type: 'personal',
            verified: element.verified,
            id: element.id,
            delete: false,
            update: false,
            valid: true}
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
const collectChages = (state, {remove, update, set}, key, webId) => [].concat(
    state.originalInformation[key].map(
      e => e.delete ? remove(webId, key, e.id)
      : (e.update && e.valid && !e.verified) ? update(webId, key, e.id, e.value)
      : null
    ), state.newInformation[key].map(
      e => (e.delete || e.blank || !e.valid)
      ? null : set(webId, e.value)
  ))

export const submitChanges = (backend, services, state) => {
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
  let webId = localStorage.getItem('jolocom.webId')
  let promises = [].concat(
    collectChages(state, emailOperations, 'email', webId),
    collectChages(state, phoneOperations, 'phone', webId))
  return Promise.all(promises)
}
