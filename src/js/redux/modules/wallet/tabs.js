import * as _ from 'lodash'
import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'

const PATHNAME_TO_TAB = {
  '/wallet/identity': 'identity',
  '/wallet/money': 'money'
}
const TAB_TO_PATHNAME = _.invert(PATHNAME_TO_TAB)

const actions = module.exports = makeActions('wallet/tabs', {
  detectActiveTab: {
    expectedParams: ['path'],
    creator: (params) => {
      return (dispatch, getState) => {
        // const state = getState()
        const cleanPath = params.path.replace(/^(.+)\/+$/, '$1')
        const activeTab = PATHNAME_TO_TAB[cleanPath] || null
        dispatch(actions.detectActiveTab.buildAction({path: cleanPath, activeTab}))
      }
    }
  },
  switchTab: {
    expectedParams: ['tab'],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(router.pushRoute(TAB_TO_PATHNAME[params.tab]))
      }
    }
  }
})

const initialState = Immutable.fromJS({
  activeTab: null
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.detectActiveTab.id:
    console.log(action, state.merge({
        activeTab: action.activeTab
      }).toJS())
      return state.merge({
        activeTab: action.activeTab
      })
    default:
      return state
  }
}

// const helpers = module.exports.helpers = {}
