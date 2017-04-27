import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'

import {
  verifyFields,
  newField,
  updateField,
  saveFields
} from '../../../lib/edit-contact-util'

const actions = module.exports = makeActions('wallet/contact', {
  saveChanges: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.validate())
        const state = getState().getIn(['wallet', 'contact']).toJS()
        if (!state.showErrors) {
          dispatch(actions.saveChanges.buildAction(params, (backend) => {
            const emailOperations = {
              set: backend.wallet.setEmail,
              delete: backend.wallet.deleteEmail,
              update: backend.wallet.updateEmail
            }
            const emailKey = {field: 'emails', attribute: ['address']}
            const phoneOperations = {
              set: backend.wallet.setPhone,
              delete: backend.wallet.deletePhone,
              update: backend.wallet.updatePhone
            }
            const phoneKey = {field: 'emails', attribute: ['address']}
            let promises = []
            saveFields(state.information, emailOperations, emailKey, promises)
            saveFields(state.information, phoneOperations, phoneKey, promises)
            return Promise.all(promises)
          })).then(() => dispatch(router.pushRoute('/wallet/identity')))
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
      telNums: [],
      emails: []
    }
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
      return Immutable.fromJS({
        loading: false,
        showErrors: false,
        information: {
          newInformation: {
            emails: [],
            telNums: []
          },
          originalInformation: {
            emails: action.result.emails.map((address) => {
              return {...address, delete: false, update: false, valid: true}
            }),
            telNums: action.result.telNums.map((telNums) => {
              return {...telNums, delete: false, update: false, valid: true}
            })
          }
        }
      })

    case actions.setInformation.id:
      if (action.field === 'emails') {
        return state.mergeIn(
        ['information', 'newInformation', 'emails', action.index], {
          address: action.value,
          valid: /^([\w.]+)@([\w.]+)\.(\w+)/.test(action.value),
          blank: action.value === ''
        })
      }
      if (action.field === 'telNums') {
        return state.mergeIn(
        ['information', 'newInformation', 'telNums', action.index], {
          num: action.value.num,
          type: action.value.type,
          valid: /^([\d.]+)$/.test(action.value.num),
          blank: action.value.num === ''
        })
      }
      return state

    case actions.deleteInformation.id:
      return state.mergeIn(
        ['information', action.age, action.field, action.index], {delete: true}
      )

    case actions.updateInformation.id:
      return updateField(state, action)

    case actions.addNewEntry.id:
      return newField(state, action)

    case actions.validate.id:
      return verifyFields(state, action)

    default:
      return state
  }
}
