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
        dispatch(router.pushRoute('wallet/sso/shared-data'))
      }
    }
  },
  goToAccessRightScreen: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch) => {
        dispatch(router.pushRoute('wallet/sso/access-rights'))
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
          }).then((result) => {
            dispatch(actions.retrieveConnectedServices())
            return 'OK'
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
          backend.gateway.getConnectedServicesOverview({
            userName: services.auth.currentUser.wallet.userName
          }).then((services) => {
            const {accessRight} = getState().toJS().singleSignOn
            const result = {
              services: services,
              accessRight: accessRight
            }
            return (result)
          })
        ))
      }
    }
  },
  getIdentityInformation: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.getIdentityInformation.buildAction(params, () =>
          services.auth.currentUser.wallet.getUserInformation()
            .then((result) => {
              dispatch(actions.setIdentityInformation(result))
              dispatch(actions.retrieveConnectedServices())
              return 'OK'
            })
        ))
      }
    }
  },
  setIdentityInformation: {
    expectedParams: ['userDetails']
  }
})

const mapBackendToState = ({webId, userName, contact, passports, idCards}) => // eslint-disable-line max-len
  Immutable.fromJS({
    loaded: true,
    errorMsg: false,
    webId: webId,
    username: {value: userName},
    contact: {
      emails: contact.email,
      phones: contact.phone
    },
    passports: passports,
    idCards: idCards,
    services: []
  })

const initialState = Immutable.fromJS({
  loaded: false,
  errorMsg: '',
  serviceNumber: 0,
  services: []
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.getIdentityInformation.id_fail:
      return state.merge({
        loaded: true,
        errorMsg: 'Could not load your identity details. Please try again.'
      })

    case actions.getIdentityInformation.id_success:
      return state.merge({
        loaded: true,
        errorMsg: ''
      })

    case actions.setIdentityInformation.id:
      return mapBackendToState(action.userDetails)

    case actions.showSharedData.id:
      return state.mergeDeep({serviceNumber: action.index})

    case actions.retrieveConnectedServices.id_success:
      const services = mapConnectedServices(action.result.services, action.result.accessRight) // eslint-disable-line max-len
      return state.merge({
        loaded: true,
        errorMsg: '',
        services: services
      })

    case actions.retrieveConnectedServices.id_fail:
      return state.merge({
        loaded: true,
        errorMsg: 'Your services overview could not be loaded. Please try again.' // eslint-disable-line max-len
      })

    case actions.retrieveConnectedServices.id:
      return state.merge({
        loaded: false,
        errorMsg: ''
      })

    case actions.deleteService.id:
      return state.merge({
        loaded: false,
        errorMsg: ''
      })

    case actions.deleteService.id_success:
      return state.merge({
        loaded: true,
        errorMsg: ''
      })

    case actions.deleteService.id_fail:
      return state.merge({
        loaded: true,
        errorMsg: 'Service could not be deleted. Please try again.'
      })

    default:
      return state
  }
}

function mapConnectedServices(services, identity) {
  let arrayServices = []
  services.map((field, index) => {
    let display = field.identity.split('/')
    let orderedPattern = field.pattern.split('/')
    let attribute = orderedPattern[2]
    let patternType = orderedPattern[3]
    let identityAttribute
    if (orderedPattern.length === 3 || orderedPattern.length === 5) {
      return
    }
    if (attribute === 'email' || attribute === 'phone') {
      identityAttribute = identity.contact
    } else {
      identityAttribute = identity
    }

    if (patternType === '*') {
      let items = identityAttribute[attribute + 's']
      let sharedData = []

      items.map((item, index) => {
        let value
        if (item.hasOwnProperty('number')) {
          value = item.number
        } else {
          value = item.address
        }
        let sharedDetails = {
          attrType: attribute,
          value: value,
          type: item.type,
          verified: item.verified
          // status: ''
        }
        sharedData.push(sharedDetails)
      })

      let cluster = _.find(arrayServices, {label: field.identity})
      if (cluster !== undefined) {
        cluster.sharedData.push(sharedData)
      } else {
        let detailsService = {
          deleted: false,
          label: field.identity,
          displayName: display[3],
          url: 'dummy url',
          id: index,
          pattern: field.pattern,
          iconUrl: 'img/img_nohustle.svg',
          sharedData: sharedData
        }
        arrayServices.push(detailsService)
      }
    } else {
      let item = _.find(identityAttribute[attribute + 's'], {id: patternType}) // eslint-disable-line max-len
      let value
      if (item.hasOwnProperty('number')) {
        value = item.number
      } else {
        value = item.address
      }
      let sharedDetails = {
        attrType: attribute,
        value: value,
        type: item.type,
        verified: item.verified
        // status: ''
      }
      let cluster = _.find(arrayServices, {label: field.identity})
      if (cluster !== undefined) {
        cluster.sharedData.push(sharedDetails)
        arrayServices.push(cluster)
      } else {
        let detailsService = {
          deleted: false,
          label: field.identity,
          displayName: display[3],
          url: 'dummy url',
          id: index,
          pattern: field.pattern,
          iconUrl: 'img/img_nohustle.svg',
          sharedData: [sharedDetails]
        }
        arrayServices.push(detailsService)
      }
    }
  })
  return arrayServices
}
