import Immutable from 'immutable'

export const verify = (state) => {
  const {newInformation, originalInformation} = state.get('information').toJS()
  const newFields = newInformation.emails.concat(newInformation.phoneNumbers)
  const oldValues = originalInformation.emails.concat(
    originalInformation.phoneNumbers)
  const isValid = (
    oldValues.every(
      e => (e.valid || e.delete || e.update) && !(e.verified && e.update))) &&
    (newFields.every(
      e => (e.blank || e.valid || e.delete)))
  return state.setIn(['showErrors'], !isValid)
}

const isBlank = (value, field) => field === 'phoneNumbers'
  ? value.number === '' : value === ''

const isValidValue = (value, field) => field === 'phoneNumbers'
  ? (/^([\d.]+)/.test(value.number) || /^\+([\d]+)$/.test(value.number))
  : /^([\w.]+)@([\w.]+)\.(\w+)/.test(value)

const parseValue = (value, field) => field === 'phoneNumbers'
  ? {value: value.number, type: value.type} : {value}

const addNew = (field) => field === 'phoneNumbers'
  ? {value: '', type: 'home'} : {value: ''}

export const set = (state, {field, index, value}) => state.mergeIn(
  ['information', 'newInformation', field, index], {
    ...parseValue(value, field),
    valid: isValidValue(value, field),
    blank: isBlank(value, field)
  })

export const initiate = ({emails, phoneNumbers}) => Immutable.fromJS({
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

export const add = (state, {field}) => state.updateIn(
  ['information', 'newInformation', field],
  arr => arr.push({
    ...addNew(field),
    valid: false,
    delete: false,
    blank: true
  }))

const canUpdate = (state, field, index) => state.getIn(
  ['information', 'originalInformation', field, index, 'verified']) ||
  state.getIn(['information', 'originalInformation', field]).toJS().length === 0

export const update = (state, {field, value, index}) => canUpdate(state, field, index) // eslint-disable-line max-len
  ? state
  : state.mergeIn(['information', 'originalInformation', field, index], {
    ...parseValue(value, field),
    valid: isValidValue(value, field),
    delete: value === '',
    update: true
  })

const save = (state, {remove, update, set}, key) => [].push(
  state.originalInformation[key].map(e => e.delete ? remove(e.value)
    : (e.update && e.valid && !e.verified) ? update(e.value) : null
  ),
  state.newInformation[key].map(e => (e.delete || e.blank || !e.valid)
    ? null : set(e.value)
  ))

export const submitChanges = ({wallet}, state) => {
  const emailOperations = {
    set: wallet.setEmail,
    remove: wallet.deleteEmail,
    update: wallet.updateEmail
  }
  const phoneOperations = {
    set: wallet.setPhone,
    remove: wallet.deletePhone,
    update: wallet.updatePhone
  }

  return Promise.all([].push(
    save(state, emailOperations, 'emails'),
    save(state, phoneOperations, 'phoneNumbers')
  ))
}
