import camelCase from 'lodash/camelCase'
import { action } from '../'

export function genericReducer(actions, {initialState}) {
  return function reducer(state = initialState, action = {}) {
    switch (action.type) {
      case actions.show.id:
        return true
      case actions.hide.id:
        return false
      case actions.toggle.id:
        return !state
      default:
        return state
    }
  }
}

export default function creator(prefix, type, {initialValue = false}) {
  const camelCaseType = camelCase(type)
  const actions = {
    show: action(prefix, 'show' + camelCaseType, {
      expectedParams: []
    }),
    hide: action(prefix, 'hide' + camelCaseType, {
      expectedParams: []
    }),
    toggle: action(prefix, 'toggle' + camelCaseType, {
      expectedParams: []
    })
  }
  return {
    reducer: genericReducer(actions, {initialState: initialValue}),
    actions
  }
}
