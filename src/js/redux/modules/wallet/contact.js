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
        const state = getState().getIn(['wallet', 'contact']).toJS()
        // dispatch(router.pushRoute('/wallet/identity'))
        // dispatch(router.pushRoute('/wallet/identity/contact'))
    //     let promises = []
    //     const state = getState().toJS()
    //     for (let prop in state.originalInformation) {
    //       for (let i = 0; i < state.originalInformation[prop].length; i++) {
    //
    //       }
    //     }
    //   }
        dispatch(actions.saveChanges.buildAction(params, (backend) => { //eslint-disable-line
          let promises = []
          // console.log(state)
          for (let i = 0;
            i < state.information.originalInformation.emails.length; i++) {
            if (state.information.originalInformation.emails[i].delete) {
              promises.push(
                backend.wallet.deleteEmail(
                  state.information.originalInformation.emails[i].address))
            } else if (state.information.originalInformation.emails[i].update) {
              promises.push(
                backend.wallet.updateEmail(
                  state.information.originalInformation.emails[i].address))
            }
          }
          for (let i = 0;
            i < state.information.newInformation.emails.length; i++) {
            promises.push(
              backend.wallet.setEmail(
                state.information.newInformation.emails[i].address))
          }
          // console.log(promises)
          return Promise.all(promises)
          // .then(dispatch(router.pushRoute('/wallet/identity')))
        }))
        // dispatch(router.pushRoute('/wallet/identity'))
      }
    }
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
    expectedParams: ['field', 'index']
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
  loading: true
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.getAccountInformation.id_success:
      let initialState = {
        originalInformation: action.result
      }
      // let prop
      // console.log(action.result)
      for (let prop in initialState.originalInformation) {
        for (let i = 0; i < initialState.originalInformation[prop].length; i++) { // eslint-disable-line max-len
          initialState.originalInformation[prop][i].delete = false
          initialState.originalInformation[prop][i].update = false
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
        // console.log(localState)
        return Immutable.fromJS(localState)
      }
      return state

    case actions.deleteInformation.id:
      return state.setIn(['information', 'originalInformation',
        action.field, action.index, 'delete'], true)

    case actions.updateInformation.id:
      if (state.getIn(['information', 'originalInformation',
        action.field, action.index, 'verified']) === false) {
        state = state.setIn(['information', 'originalInformation',
          action.field, action.index, 'update'], true)
        if (action.field === 'emails') {
          state = state.setIn(['information', 'originalInformation',
            action.field, action.index, 'address'], action.value)
        }
      }
      return state

    case actions.addNewEntry.id:
      // console.log(state)
      let newArray = state.getIn(
        ['information', 'newInformation', action.field])
        .push({address: '', valid: false})
      return state.setIn(['information', 'newInformation', action.field],
       newArray)
    default:
      return state
  }
}
