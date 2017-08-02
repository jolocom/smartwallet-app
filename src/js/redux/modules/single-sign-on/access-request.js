import Immutable from 'immutable'
import {makeActions} from '../'
import * as router from '../router'

const actions = module.exports = makeActions('single-sign-on/access-request', {
  requestedDetails: {
    expectedParams: ['details'],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.requestedDetails.buildAction(params))
        dispatch(actions.getRequesterIdentity(params.requester))
      }
    }
  },
  getRequesterIdentity: {
    expectedParams: ['identity'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services}) => {
        dispatch(actions.getRequesterIdentity.buildAction(params, (backend) => {
          return backend.wallet.getRequesterIdentity(params)
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
            return backend.wallet.grantAccessToRequester(params.user, {
              identity: params.query.requester,
              patern: getPattern(params.query['scope[]']),
              read: true,
              write: false
            }).then((response) => {
              dispatch(router
                .pushRoute('wallet/single-sign-on/access-confirmation'))
            })
          }))
      }
    }
  }
})

const initialState = Immutable.fromJS({
  entity: {
    loading: false,
    name: 'SOME COMPANY',
    image: 'img/logo.svg',
    requester: '',
    returnURL: '',
    fields: []
  }
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.requestedDetails.id:
      return state.mergeIn(['entity'], {
        loading: true,
        requester: action.details.requester,
        returnURL: action.details.returnURL,
        fields: action.details['scope[]']
      })

    case actions.getRequesterIdentity.id:
      return state.mergeIn(['entity'], {
        loading: true
      })

    case actions.getRequesterIdentity.id_success:
    // TODO attach image
      return state.mergeIn(['entity'], {
        loading: false,
        name: action.result
      })

    case actions.getRequesterIdentity.id_fail:
      // console.log('fail')
      return state

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

    default:
      return state
  }
}

const getPattern = (fields) => {
  // pattern = ['/identity/phone/*']
  let pattern = []
  for (var i = 0; i < fields.length; i++) {
    pattern.push(`/identity/${fields[i]}/*`)
  }
  return pattern
}
