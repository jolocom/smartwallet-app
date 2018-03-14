import Immutable from 'immutable'
import { makeActions } from '../'

export const actions = makeActions('wallet/interactions', {
  getClaims: {
    expectedParams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, { services }) => {
        const fields = ['name', 'phone', 'email']
        let selfSigned = []
        let thirdPartySigned = []

        dispatch(actions.getClaims.buildAction(params, async () => {
          const did = await services.storage.getItem('did')

          await Promise.all(
            fields.map(async (field) => {
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
          )

          return { selfSigned, thirdPartySigned }
        }))
      }
    }
  }
})

const initialState = Immutable.fromJS({
  loading: false,
  claimsOverview: {
    selfSignedClaims: [],
    thirdPartySignedClaims: []
  }
})

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.getClaims.id:
      return state

    case actions.getClaims.id_success:
      const claimsOverview = {
        selfSignedClaims: action.result.selfSigned,
        thirdPartySignedClaims: action.result.thirdPartySigned
      }
      return state.setIn(['claimsOverview'], claimsOverview)

    default:
      return state
  }
}
