// import * as _ from 'lodash'
import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'

const actions = module.exports = makeActions('wallet/contact', {
  saveChanges: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState) => {

        dispatch(actions.validate())
        const state = getState().getIn(['wallet', 'contact']).toJS()
        const webId = getState().getIn(['wallet', 'identity', 'webId'])

        if (!state.showErrors) {
          dispatch(actions.saveChanges.buildAction(params, (backend) => {
            let promises = []
            console.log(state)
            for (let i = 0;
              i < state.information.originalInformation.emails.length; i++) {
              if (state.information.originalInformation.emails[i].delete) {
                promises.push(
                  backend.wallet.deleteEmail(
                    state.information.originalInformation.emails[i].address))
              } else if (state.information.originalInformation.emails[i].update) { //eslint-disable-line
                promises.push(
                  backend.wallet.updateEmail(
                    state.information.originalInformation.emails[i].address))
              }
            }
            for (let i = 0;
              i < state.information.newInformation.emails.length; i++) {
              if (!state.information.newInformation.emails[i].delete &&
                  !state.information.newInformation.emails[i].blank) {
                promises.push(
                backend.wallet.setEmail(
                  state.information.newInformation.emails[i].address))
              }
            }
            // console.log(promises)
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
      let initialState = {
        newInformation: {
          emails: []
        },
        originalInformation: action.result
      }
      // let prop
      // console.log(action.result)
      for (let prop in initialState.originalInformation) {
        for (let i = 0; i < initialState.originalInformation[prop].length; i++) { // eslint-disable-line max-len
          initialState.originalInformation[prop][i].delete = false
          initialState.originalInformation[prop][i].update = false
          initialState.originalInformation[prop][i].valid = true
        }
      }
      // console.log(Immutable.fromJS(action.result).toJS())
      state = state.mergeIn(['information'], Immutable.fromJS(initialState))
      return state.setIn(['loading'], false)

    case actions.setInformation.id:
      if (action.field === 'emails') {
        let localState = state.toJS()
        localState.information.newInformation
        .emails[action.index].address = action.value
        localState.information.newInformation
        .emails[action.index].valid = /^([\w.]+)@([\w.]+)\.(\w+)/
        .test(action.value)
        localState.information.newInformation
        .emails[action.index].blank = action.value === ''
        // console.log(localState)
        return Immutable.fromJS(localState)
      }
      return state

    case actions.deleteInformation.id:
      return state.setIn(['information', action.age,
        action.field, action.index, 'delete'], true)

    case actions.updateInformation.id:
      if (state.getIn(['information', 'originalInformation',
        action.field, action.index, 'verified']) === false) {
        state = state.setIn(['information', 'originalInformation',
          action.field, action.index, 'update'], true)
        if (action.field === 'emails') {
          state = state.setIn(['information', 'originalInformation',
            action.field, action.index, 'address'], action.value)
          state = state.setIn(['information', 'originalInformation',
            action.field, action.index, 'valid'], /^([\w.]+)@([\w.]+)\.(\w+)/
            .test(action.value))
          state = state.setIn(['information', 'originalInformation',
            action.field, action.index, 'delete'], action.value === '')
        }
      }
      return state

    case actions.addNewEntry.id:
      let mutableState = state.toJS()
      mutableState.information.newInformation.emails
      .push({address: '', valid: false, delete: false, blank: true})
      return Immutable.fromJS(mutableState)

    case actions.validate.id:
      // console.log(state)
      let originalEmails = state.toJS().information.originalInformation.emails
      let newEmails = state.toJS().information.newInformation.emails
      // console.log(originalEmails)
      for (let i = 0; i < originalEmails.length; i++) {
        if (originalEmails[i].update && !originalEmails[i].valid &&
            !originalEmails[i].delete) {
          return state.setIn(['showErrors'], true)
        }
      }
      for (let i = 0; i < newEmails.length; i++) {
        if (!newEmails[i].valid && !newEmails[i].delete &&
          !newEmails[i].blank) {
          return state.setIn(['showErrors'], true)
        }
      }
      return state.setIn(['showErrors'], false)

    default:
      return state
  }
}
