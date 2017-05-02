import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'

import {
initiate,
verify,
add,
update,
submitChanges,
set
} from '../../../lib/edit-contact-util'

const actions = module.exports = makeActions('wallet/contact', {
  saveChanges: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.validate())
        const {information, showErrors} = getState().toJS().wallet.contact
        if (!showErrors) {
          dispatch(actions.saveChanges.buildAction(params,
            backend => submitChanges(backend, information)
          )).then(() => dispatch(router.pushRoute('/wallet/identity')))
        }
      }
    }
  },
  validate: {
    expectedParams: []
  },
  exitWithoutSaving: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(router.pushRoute('/wallet/identity'))
      }
    }
  },
  getAccountInformation: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.getAccountInformation
        .buildAction(params, (backend) => {
          return backend.wallet.getAccountInformation()
        }))
      }
    }
  },
  setInformation: {
    expectedParams: ['field', 'index', 'value']
  },
  deleteInformation: {
    expectedParams: ['age', 'field', 'index']
  },
  updateInformation: {
    expectedParams: ['field', 'index', 'value']
  },
  addNewEntry: {
    expectedParams: ['field']
  }
})

const initialState = Immutable.fromJS({
  information: {
    newInformation: {
      phoneNumbers: [],
      emails: []
    }
  },
  originalInformation: {
    phoneNumbers: [],
    emails: []
  },
  loading: true,
  showErrors: false
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.saveChanges.id:
      return state.setIn(['loading'], true)

    case actions.saveChanges.id_success:
      return state.setIn(['loading'], false)

    case actions.getAccountInformation.id:
      return state.setIn(['loading'], true)

    case actions.getAccountInformation.id_success:
      return initiate(action.result)

    case actions.setInformation.id:
      return set(state, action)

    case actions.deleteInformation.id:
      return state.mergeIn(
        ['information', action.age, action.field, action.index], {delete: true})

    case actions.updateInformation.id:
      return update(state, action)

    case actions.addNewEntry.id:
      return add(state, action)

    case actions.validate.id:
      return verify(state)

    default:
      return state
  }
}
