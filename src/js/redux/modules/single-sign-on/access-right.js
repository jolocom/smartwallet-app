import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'
import * as _ from 'lodash'

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
          const servicesOverview = getState().toJS().singleSignOn.accessRight.services // eslint-disable-line max-len
          const service = _.find(servicesOverview, {id: params})
          return backend.gateway.revokeServiceAccess({
            userName: services.auth.currentUser.wallet.userName,
            identity: service.label,
            pattern: service.pattern
          })
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
        // backend.solid.retrieveConnectedServices()
          backend.gateway.getConnectedServicesOverview({
            userName: services.auth.currentUser.wallet.userName
          }).then((result) => {
            const {identity} = getState().toJS().wallet
            return mapConnectedServices(result, identity)
          })
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
      return state.merge({
        loaded: true,
        failed: false,
        services: action.result
      })

    case actions.retrieveConnectedServices.id_fail:
      return state.merge({
        loaded: true,
        failed: true
      })

    case actions.retrieveConnectedServices.id:
      return state.merge({
        loaded: false,
        failed: false
      })

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

function mapConnectedServices(services, identity) {
  // pattern: is a string > /identity/phone/*, /identity/email/*
  const orderedServices = []
  let count = 0
  services.map((field, index) => {
    let pattern = field.pattern.split(',')
    let orderedPattern = []

    // map pattern correctly
    pattern.map((field, index) => {
      let singlePattern = field.split('/')
      let attribute = singlePattern[1]
      let patternType = singlePattern[2]
      let identityAttribute

      if (attribute === 'email' || attribute === 'phone') {
        identityAttribute = identity.contact
      } else {
        identityAttribute = identity
      }

      if (patternType === '*') {
        let items = identityAttribute[attribute + 's']
        items.map((item, index) => {
          let value
          if (item.hasOwnProperty('number')) {
            value = item.number
          } else {
            value = item.address
          }
          let overviewPattern = {
            attrType: attribute,
            value: value,
            type: item.type,
            verified: item.verified
            // status: ''
          }
          orderedPattern.push(overviewPattern)
        })
      } else {
        let item = _.find(identityAttribute[attribute + 's'], {id: patternType})
        let value
        if (item.hasOwnProperty('number')) {
          value = item.number
        } else {
          value = item.address
        }
        let overviewPattern = {
          attrType: attribute,
          value: value,
          type: item.type,
          verified: item.verified
          // status: ''
        }
        orderedPattern.push(overviewPattern)
      }
    })
    let overviewServices = {
      deleted: false,
      label: field.identity,
      url: 'dummy url',
      id: count++,
      pattern: field.pattern,
      iconUrl: '/img/img_nohustle.svg',
      sharedData: orderedPattern
    }
    orderedServices.push(overviewServices)
  })
  return orderedServices
}
