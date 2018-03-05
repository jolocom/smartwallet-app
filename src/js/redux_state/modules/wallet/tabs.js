import invert from 'lodash/invert'
import Immutable from 'immutable'
import { makeActions } from '../'
import router from '../router'

const PATHNAME_TO_TAB = {
  '/wallet/identity': 'identity',
  // '/wallet/money': 'money'
  '/wallet/interactions': 'interactions'
}
const TAB_TO_PATHNAME = invert(PATHNAME_TO_TAB)

export const actions = makeActions('wallet/tabs', {
  detectActiveTab: {
    expectedParams: ['path'],
    creator: (params) => {
      const cleanPath = params.path.replace(/^(.+)\/+$/, '$1')
      const activeTab = PATHNAME_TO_TAB[cleanPath] || null
      return actions.detectActiveTab.buildAction({path: cleanPath, activeTab})
    }
  },
  switchTab: {
    expectedParams: ['tab'],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(router.pushRoute(TAB_TO_PATHNAME[params.tab]))
      }
    }
  },
  getClaims: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState, { services }) => {
        const fields = ['name', 'phone', 'email']
        let selfSigned = []
        let thirdPartySigned = []

        Promise.all(
          fields.map( async (field) => {
            const did = await services.storage.getItem('did')
            const storedClaims = await services.storage.getItem(field)

            if(storedClaims) {
              storedClaims.claims.map( async (claim) => {
                const claimData = await services.storage.getItem(claim.id)
                const claimObj = { field: field, value: storedClaims.value, issueDate: claimData.credential.issued }

                if (claimData.credential.issuer == did) {
                  selfSigned.push(claimObj)
                } else {
                  thirdPartySigned.push(claimObj)
                }
              })
            }
          })
        ).then(() => {
          dispatch(actions.getClaims.buildAction({ selfSigned: selfSigned, thirdPartySigned: thirdPartySigned }))
        })
      }
    }
  }
})

const initialState = Immutable.fromJS({
  activeTab: null,
  selfSignedClaims: [],
  thirdPartySignedClaims: []
})

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.detectActiveTab.id:
      return state.merge({
        activeTab: action.activeTab
      })
    case actions.getClaims.id:
      return state.merge({
        selfSignedClaims: action.selfSigned,
        thirdPartySignedClaims: action.thirdPartySigned
      })
    default:
      return state
  }
}

// const helpers = module.exports.helpers = {}
