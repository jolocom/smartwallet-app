import Immutable from 'immutable'
import {makeActions} from './'
import * as router from './router'

const actions = module.exports = makeActions('ethereum-connect', {
  toggleSecuritySection: {
    expectedParams: ['value']
  },
  setFundsNotSufficient: {
    expectedParams: []
  },
  checkUserLoggedIn: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        const user = services.auth.currentUser
        console.log(user)
        const path = getState().toJS().ethereumConnect.path
        if (user == null) {
          dispatch(router.pushRoute({
            pathname: '/login',
            query: {
              callbackUrl: path
            }
          }))
        }
      }
    }
  },
  getRequestedDetails: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.getRequestedDetails.buildAction(params))
        dispatch(actions.checkUserLoggedIn())
        // dispatch(actions.getRequesterIdentity(params.query.requester))
      }
    }
  }
})

const initialState = Immutable.fromJS({
  loading: false,
  errorMsg: '',
  expanded: false,
  fundsNotSufficient: false,
  path: ''
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.toggleSecuritySection.id:
      return state.merge({
        expanded: action.value
      })

    case actions.setFundsNotSufficient.id:
      return state.merge({
        fundsNotSufficient: true
      })

    case actions.getRequestedDetails.id:
      // if (typeof action.details.query['scope[]'] === 'string') {
      //   action.details.query['scope[]'] = [action.details.query['scope[]']]
      // }
      return state.merge({
        path: action.pathname + action.search
        // requester: action.details.query.requester,
        // returnURL: action.details.query.returnURL,
        // fields: action.details.query['scope[]']
      })

    default:
      return state
  }
}
