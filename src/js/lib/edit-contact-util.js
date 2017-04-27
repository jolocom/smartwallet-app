export const verifyFields = (state, action) => {
  const info = state.get('information').toJS()
  const originals = info.newInformation.emails
    .concat(info.newInformation.telNums)
  const newFields = info.originalInformation.emails
    .concat(info.originalInformation.telNums)
  const error = originals.every(e => !e.valid && !e.delete && !e.blank) ||
    newFields.every(e => e.update && !e.valid && !e.delete)
  return state.setIn(['showErrors'], error)
}

export const newField = (state, action) => {
  if (action.field === 'emails') {
    return state.updateIn(['information', 'newInformation', 'emails'],
      arr => arr.push({
        address: '',
        valid: false,
        delete: false,
        blank: true
      })
    )
  }
  if (action.field === 'telNums') {
    return state.updateIn(['information', 'newInformation', 'emails'],
      arr => arr.push({
        address: '',
        valid: false,
        delete: false,
        blank: true
      })
    )
  }
  return state
}

export const updateField = (state, action) => {
  if (!state.getIn(['information', 'originalInformation',
    action.field, action.index, 'verified'])) {
    if (action.field === 'emails') {
      return state.mergeIn(
        ['information', 'originalInformation', 'emails', action.index], {
          address: action.value,
          valid: /^([\w.]+)@([\w.]+)\.(\w+)/.test(action.value),
          delete: action.value === '',
          update: true
        }
      )
    }
    if (action.field === 'telNums') {
      return state.mergeIn(
        ['information', 'originalInformation', 'telNums', action.index], {
          num: action.value.num,
          type: action.value.type,
          valid: /^([\d.]+)/.test(action.value.num),
          delete: action.value === '',
          update: true
        }
      )
    }
  }
  return state
}

export const saveFields = (state, operation, key, promises) => {
  for (let i = 0;
    i < state.originalInformation[key.field].length; i++) {
    if (state.originalInformation[key.field][i].delete) {
      promises.push(operation.delete(
          state.originalInformation[key.field][i][key.attribute]
      ))
    } else if (
      state.originalInformation[key.field][i][key.attribute]) {
      promises.push(operation.update(
        state.originalInformation[key.field][i][key.attribute]
      ))
    }
  }
  for (let i = 0;
    i < state.newInformation[key.field].length; i++) {
    if (!state.newInformation[key.field][i].delete &&
        !state.newInformation[key.field][i].blank) {
      promises.push(operation.set(
        state.newInformation[key.field][i][key.attribute]
      ))
    }
  }
  return promises
}
