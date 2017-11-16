import Immutable from 'immutable'
import {makeActions} from '../'
import * as router from '../router'

const actions = module.exports = makeActions('single-sign-on/access-request', {
  checkUserLoggedIn: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        const user = services.auth.currentUser
        const path = getState().toJS().singleSignOn.accessRequest.entity.path
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
  requestedDetails: {
    expectedParams: ['details'],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.requestedDetails.buildAction(params))
        dispatch(actions.checkUserLoggedIn())
        dispatch(actions.getRequesterIdentity(params.query.requester))
      }
    }
  },
  getRequesterIdentity: {
    expectedParams: ['identity'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        dispatch(actions.getRequesterIdentity.buildAction(params, (backend) => {
          return backend.gateway.proxyGet(params + '/identity/name/display')
        }))
      }
    }
  },
  setInfoComplete: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.setInfoComplete.buildAction())
      }
    }
  },
  goToMissingInfo: {
    expectedparams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        const route = getRoute(params)
        const path = getState().toJS().singleSignOn.accessRequest.entity.path
        dispatch(router.pushRoute({
          pathname: route,
          query: {
            callbackUrl: path
          }
        }))
      }
    }
  },
  grantAccessToRequester: {
    expectedparams: ['user', 'query'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.grantAccessToRequester.buildAction(params,
          (backend) => {
            const {requester} = getState().toJS().singleSignOn.accessRequest.entity // eslint-disable-line max-len
            const userURL = services.auth.currentUser.wallet.identityURL
            return backend.gateway.grantAccessToRequester(userURL, {
              identity: requester,
              pattern: getPattern(params.query['scope[]']),
              read: true,
              write: false
            }).then((response) => {
              dispatch(router.pushRoute('wallet/single-sign-on/access-confirmation')) // eslint-disable-line max-len
            })
          }))
      }
    }
  },
  redirectToReturnUrl: {
    expectedparams: [],
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        const userURL = services.auth.currentUser.wallet.identityURL
        const {returnURL} = getState().toJS().singleSignOn.accessRequest.entity // eslint-disable-line max-len
        dispatch(() => {
          window.location = returnURL + '?success=true&identity=' + encodeURIComponent(userURL) // eslint-disable-line max-len
        })
      }
    }
  }
})

const initialState = Immutable.fromJS({
  entity: {
    loading: false,
    path: '',
    name: 'SOME COMPANY',
    image: 'img/hover_board.jpg',
    requester: '',
    returnURL: '',
    fields: [],
    infoComplete: false
  }
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.requestedDetails.id:
      if (typeof action.details.query['scope[]'] === 'string') {
        action.details.query['scope[]'] = [action.details.query['scope[]']]
      }
      return state.mergeIn(['entity'], {
        loading: true,
        path: action.details.pathname + action.details.search,
        requester: action.details.query.requester,
        returnURL: action.details.query.returnURL,
        fields: action.details.query['scope[]']
      })

    case actions.getRequesterIdentity.id:
      return state.mergeIn(['entity'], {
        loading: true
      })

    case actions.getRequesterIdentity.id_success:
      return state.mergeIn(['entity'], {
        loading: false,
        name: action.result.value
      })

    case actions.getRequesterIdentity.id_fail:
      return state.mergeIn(['entity'], {
        loading: false,
        name: 'Highspeed Hover Board'
      })

    case actions.grantAccessToRequester.id:
      return state.mergeIn(['entity'], {
        loading: true
      })

    case actions.grantAccessToRequester.id_success:
      return state.mergeIn(['entity'], {
        loading: false
      })

    case actions.grantAccessToRequester.id_fail:
      return state.mergeIn(['entity'], {
        loading: false
      })

    case actions.setInfoComplete.id:
      return state.mergeIn(['entity'], {
        infoComplete: true
      })

    default:
      return state
  }
}

const getPattern = (fields) => {
  // pattern = ['/identity/phone/*']
  let pattern = []
  for (var i = 0; i < fields.length; i++) {
    pattern.push(`/identity/${fields[i]}/*`)
    pattern.push(`/identity/${fields[i]}`)
    pattern.push(`/identity/${fields[i]}/*/verifications`)
  }
  return pattern
}

const getRoute = (field) => {
  if (field === 'phone' || field === 'email' || field === 'address') {
    return 'wallet/identity/contact'
  } else if (field === 'idcard' || field === 'passport') {
    return 'wallet/identity/passport/add'
  }
}
