import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'

const actions = module.exports = makeActions('single-sign-on/access-right', {
  showSharedData: {
    expectedParams: ['index'],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.showSharedData.buildAction(params))
        dispatch(router.pushRoute('/single-sign-on/shared-data'))
      }
    }
  },
  goToAccessRightScreen: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch) => {
        dispatch(router.pushRoute('single-sign-on/access-right'))
      }
    }
  },
  deleteService: {
    async: true,
    expectedParams: ['id'],
    creator: (params) => {
      return (dispatch, getState, {backend, services}) => {
        dispatch(actions.deleteService.buildAction(params, () => {
          return backend.solid.deleteService(params)
        }))
      }
    }
  },
  retrieveConnectedServices: {
    async: true,
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState, {backend, services}) => {
        dispatch(actions.retrieveConnectedServices.buildAction(params, () =>
        backend.solid.retrieveConnectedServices()
          // backend.gateway.getConnectedServicesOverview({
          //   userName: services.auth.currentUser.wallet.userName
          // })
        ))
      }
    }
  }
})

const initialState = Immutable.fromJS({
  loaded: false,
  failed: true,
  serviceNumber: 0,
  services: []
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.showSharedData.id:
      return state.mergeDeep({serviceNumber: action.index})

    case actions.retrieveConnectedServices.id_success:
      console.log('RETRIEVE CONNECTED SERVICES: ', action.result)
      // result will be: [{identity, pattern, read, write}]
      return state.mergeDeep(action.result).merge({
        loaded: true,
        failed: false
      })

    case actions.retrieveConnectedServices.id_fail:
      return state.merge({
        loaded: true,
        failed: true
      })

    case actions.retrieveConnectedServices.id:
      return state.merge({loaded: false, failed: false})

    case actions.deleteService.id:
      return state.merge({
        failed: false,
        loaded: false
      })

    case actions.deleteService.id_success:
      return state.merge({
        failed: false,
        loaded: true
      })

    case actions.deleteService.id_fail:
      return state.merge({
        loaded: true,
        failed: true
      })

    default:
      return state
  }
}

function mapConnectedServices(services) {
  services.map((field, index) => {
    
  })
}
// result will be: [{identity, pattern, read, write}]

// {
//   deleted: false, label: 'label1', url: 'http://www.youtube.com',
//   id: '1', iconUrl: '/img/img_nohustle.svg',
//   sharedData: [
//     {attrType: 'phone', value: '17524', type: 'work', verified: false,
//       status: ''},
//     {attrType: 'phone', value: '45678', type: 'work', verified: true,
//       status: ''},
//     {attrType: 'phone', value: '96574', type: 'work', verified: true,
//       status: ''},
//     {attrType: 'email', value: 'test@test.test', verified: false,
//       status: ''}
//   ]
// }
