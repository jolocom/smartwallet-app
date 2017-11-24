import Immutable from 'immutable'
import {makeActions} from './'
import * as router from './router'

export const actions = makeActions('ethereum-connect', {
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
          dispatch(actions.checkRequestedParams(params.query))
          return backend.gateway.proxyGet(`${params.query.requester}/ethereum/contracts/${params.query.contractID}`) // eslint-disable-line max-len
            .then((response) => {
              dispatch(actions.setContractDetails(response))
              return backend.gateway.proxyGet(`${params.query.requester}/identity/name/display`) // eslint-disable-line max-len
            })
            .then((response) => {
              dispatch(actions.setDisplayNameRequester(response))
              // dispatch(actions.getSecurityDetails(params))
            })
        }))
      }
    }
  },
  checkRequestedParams: {
    expectedParams: []
  },
  setDisplayNameRequester: {
    expectedParams: ['displayName']
  },
  setContractDetails: {
    expectedParams: ['contract']
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
    expectedParams: ['requester', 'contractID', 'method', 'params', 'value', 'returnURL'],  // eslint-disable-line max-len
    async: true,
    creator: (params) => {
      return (dispatch, getState, {backend, services}) => {
        dispatch(actions.executeTransaction.buildAction(params, () => {
          return backend.gateway.executeEthereumTransaction({
            userName: services.auth.currentUser.wallet.userName,
            seedPhrase: services.auth.currentUser.wallet.seedPhrase,
            ...params
          }).then((result) => { window.location.href = params.returnURL + '?success=true&txhash=' + encodeURIComponent(result.txHash) }) // eslint-disable-line max-len
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
  requesterName: 'Example',
  contractShortName: 'example',
  methods: '',
  noSecurityVerfication: true,
  securityDetails: [{
    type: 'Contract Ownerhsip',
    text: 'No verified contract owner',
    verified: false
  },
  {
    type: 'Security Audit',
    text: 'This contract is not audited for security',
    verified: false
  },
  {
    type: 'Method Audit',
    text: 'The functionality of this contract is not confirmed',
    verified: false
  }]
})

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.checkRequestedParams.id:
      const paramsCheck = action.value === undefined || action.method === undefined || action.requester === undefined || action.returnURL === undefined || action.contractID === undefined // eslint-disable-line max-len
      if (paramsCheck) {
        return state.merge({
          errorMsg: 'Critical infromation is missing. Please contact the service provider!' // eslint-disable-line max-len
        })
      } else {
        return state.merge({
          errorMsg: ''
        })
      }

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
        loading: true
      })

    case actions.getRequestedDetails.id_success:
      return state.merge({
        loading: false
      })

    case actions.getRequestedDetails.id_fail:
      return state.merge({
        loading: false
      })

    case actions.setContractDetails.id:
      const methods = getMethodsDetails(action.contract.methods)
      return state.merge({
        contractShortName: action.contract.short_name,
        methods: methods
      })

    case actions.getSecurityDetails.id:
      return state.merge({
        loading: true,
        errorMsg: ''
      })

    case actions.getSecurityDetails.id_success:
      return state.merge({
        loading: false,
        errorMsg: '',
        securityDetails: action.response
      })

    case actions.getSecurityDetails.id_fail:
      return state.merge({
        loading: false,
        errorMsg: 'Could not load the contract security details. Please try again.' // eslint-disable-line max-len
      })

    case actions.executeTransaction.id:
      return state.merge({
        loading: true,
        errorMsg: ''
      })

    case actions.executeTransaction.id_success:
      return state.merge({
        loading: false,
        errorMsg: ''
      })

    case actions.executeTransaction.id_fail:
      return state.merge({
        loading: false,
        errorMsg: 'The transaction could not be executed. Please try again.'
      })

    default:
      return state
  }
}

const getMethodsDetails = (methods) => {
  let orderedMethods = []
  for (var key in methods) {
    orderedMethods.push({name: key, description: methods[key].description})
  }
  return orderedMethods
}
