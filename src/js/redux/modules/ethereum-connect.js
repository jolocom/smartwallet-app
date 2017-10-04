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
    expectedParams: ['path'],
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        const user = services.auth.currentUser
        if (user == null) {
          dispatch(router.pushRoute({
            pathname: '/login',
            query: {
              callbackUrl: params
            }
          }))
        }
      }
    }
  },
  getRequestedDetails: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {backend, services}) => {
        dispatch(actions.getRequestedDetails.buildAction(params, () => {
          const path = params.pathname + params.search
          dispatch(actions.checkUserLoggedIn(path))
          return backend.gateway
            .proxyGet(`${params.query.requester}/identity/name/display`)
            .then((response) => {
              dispatch(actions.setDisplayNameRequester(response))
              return backend.gateway
                .proxyGet(`${params.query.requester}/ethereum/contracts/${params.query.contractID}`) // eslint-disable-line max-len
            })
            .then((response) => {
              console.log('RESPONSE GET CONTRACTID DETAILS: ', response)
              dispatch(actions.getSecurityDetails(params))
            })
        }))
      }
    }
  },
  setDisplayNameRequester: {
    expectedParams: ['displayName']
  },
  getSecurityDetails: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {backend, services}) => {
        dispatch(actions.getSecurityDetails.buildAction(params, () => {
          return backend.gateway
            .proxyGet(`${params.query.requester}/ethereum/${params.query.contractID}/verifications`) // eslint-disable-line max-len
        }))
      }
    }
  },
  getSecurityVerifications: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {backend, services}) => {
        // implement all ids to be called
        const verificationIDs = getState().toJS().ethereumConnect.securityDetails // eslint-disable-line max-len
        dispatch(actions.getSecurityVerifications.buildAction(params, () => {
          return backend.gateway
            .proxyGet(`${params.query.requester}/ethereum/${params.query.contractID}/verifications/${verificationIDs[0]}`) // eslint-disable-line max-len
        }))
      }
    }
  },
  executeTransaction: {
    expectedParams: [
      'requester', 'contractID', 'method', 'params', 'value', 'returnURL'
    ],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {backend, services}) => {
        // const { id, pin } = getState().toJS().wallet.identity
        //     .contact.emails[params.index]

        dispatch(actions.executeTransaction.buildAction(params, () => {
          return backend.gateway.executeEthereumTransaction({
            userName: services.auth.currentUser.wallet.userName,
            seedPhrase: services.auth.currentUser.wallet.seedPhrase,
            ...params
          }).then(() => { window.location.href = params.returnURL })
        }))
      }
    }
  }
})

const initialState = Immutable.fromJS({
  loading: false,
  errorMsg: '',
  expanded: false,
  fundsNotSufficient: false,
  requesterName: '',
  securityDetails: []
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

    case actions.setDisplayNameRequester.id:
      return state.merge({
        requesterName: action.displayName[0][1]
      })

    case actions.getRequestedDetails.id:
      return state.merge({
        loading: true,
        errorMsg: ''
      })

    case actions.getRequestedDetails.id_success:
      console.log('SUCCESS getRequestedDetails')
      return state.merge({
        loading: false,
        errorMsg: ''
      })

    case actions.getRequestedDetails.id_fail:
      console.log('FAIL getRequestedDetails')
      return state.merge({
        loading: false,
        errorMsg: 'Could not load the contract details. Please try again.'
      })

    case actions.getSecurityDetails.id:
      return state.merge({
        loading: true,
        errorMsg: ''
      })

    case actions.getSecurityDetails.id_success:
      console.log('SUCCESS getSecurityDetails: ', action)
      return state.merge({
        loading: false,
        errorMsg: '',
        securityDetails: action.response
      })

    case actions.getSecurityDetails.id_fail:
      console.log('FAIL getSecurityDetails')
      return state.merge({
        loading: false,
        errorMsg: 'Could not load the contract security details. Please try again.' // eslint-disable-line max-len
      })

    default:
      return state
  }
}
