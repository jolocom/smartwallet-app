import Immutable from 'immutable'
import { makeActions } from '../'
import * as router from '../router'

const actions = module.exports = makeActions('single-sign-on/access-right', {
  showSharedData: {
    expectedParams: ['index'],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(router.pushRoute('/service/detail'))
      }
    }
  },
  deleteService: {
    expectedParams: ['index']
  },
  getServicesDetails: {
    async: true,
    expectedParams: []
  }
})

const initialState = Immutable.fromJS({
  loaded: false,
  failed: false,
  id: '',
  showServiceDetails: '',
  services: [
    {
      deleted: false,
      label: 'label1',
      id: '1',
      iconUrl: '/img/img_nohustle.svg',
      sharedData: [{
        field: '',
        value: '',
        verified: false,
        status: ''
      }]
    }, {
      deleted: false,
      label: 'label2',
      id: '2',
      iconUrl: '/img/img_nohustle.svg',
      sharedData: [{
        field: '',
        value: '',
        verified: false,
        status: ''
      }]
    }, {
      deleted: false,
      id: '3',
      label: 'label3',
      iconUrl: '/img/img_nohustle.svg',
      sharedData: [{
        field: '',
        value: '',
        verified: false,
        status: ''
      }]
    }
  ]
})

module.exports.default = (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.showSharedData.id:
      return state

    case actions.deleteService.id:
      return state.mergeIn(['services', action.index], {
        deleted: true
      })

    default:
      return state
  }
}
