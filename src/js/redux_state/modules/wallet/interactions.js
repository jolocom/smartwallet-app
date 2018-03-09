import invert from 'lodash/invert'
import Immutable from 'immutable'
import { makeActions } from '../'
import router from '../router'

export const actions = makeActions('wallet/interactions', {
  getClaims: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState, { services }) => {
        const fields = ['name', 'phone', 'email']
        let selfSigned = []
        let thirdPartySigned = []

        Promise.all(
          fields.map(async (field) => {
            const did = await services.storage.getItem('did')
            const storedClaims = await services.storage.getItem(field)

            if (storedClaims) {
              storedClaims.claims.map(async (claim) => {
                const claimData = await services.storage.getItem(claim.id)
                const claimObj = {
                  field: field,
                  value: storedClaims.value,
                  issueDate: claimData.credential.issued
                }

                if (claimData.credential.issuer === did) {
                  selfSigned.push(claimObj)
                } else {
                  thirdPartySigned.push(claimObj)
                }
              })
            }
          })
        ).then(() => {
          dispatch(actions.getClaims.buildAction({
            selfSigned: selfSigned,
            thirdPartySigned: thirdPartySigned
          }))
        })
      }
    }
  }
})

const initialState = Immutable.fromJS({
  selfSignedClaims: [],
  thirdPartySignedClaims: []
})

export default (state = initialState, action = {}) => {
  switch (action.type) {
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
