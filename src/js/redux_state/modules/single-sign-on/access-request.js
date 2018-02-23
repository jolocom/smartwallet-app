import Immutable from 'immutable'
import {makeActions} from '../'
import router from '../router'
import { actions as simpleDialogActions } from '../simple-dialog'

export const actions = makeActions('single-sign-on/access-request', {
  setInfoComplete: {
    expectedParams: []
  },
  getDid: {
    expectedParams: [],
    async: true,
    creator: () => {
      return async (dispatch, getState, {services}) => {
        const did = await services.storage.getItem('did')
        if (did) {
          dispatch(actions.setDid({did}))
        }
      }
    }
  },
  confirmAccess: {
    expectedparams: [],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) => {
        dispatch(actions.confirmAccess.buildAction(params, async () => {
          const { response, did } = getState().toJS().singleSignOn.accessRequest.entity // eslint-disable-line max-len
          const { scannedValue } = getState().toJS().wallet.identityNew.scanningQr // eslint-disable-line max-len

          let promises = []
          for (var key in response) {
            promises.push(services.storage.getItem(response[key]))
          }

          const claims = await Promise.all(promises)
          let claimsArray = []
          claims.map((claim) => {
            claimsArray.push({[claim.credential.type]: claim})
          })

          const encWif = await services.storage.getItem('genericKeyWIF')
          let wif
          try {
            // eslint-disable-next-line
            const decryptionPass = await services.storage.getItemSecure('encryptionPassword')
            wif = await backend.encryption.decryptInformation({
              ciphertext: encWif.crypto.ciphertext,
              password: decryptionPass,
              salt: encWif.crypto.kdfParams.salt,
              iv: encWif.crypto.cipherparams.iv
            })
          } catch (err) {
            console.warn(err)
            wif = await services.storage.getItem('tempGenericKeyWIF')
          }

          const token = await backend.jolocomLib.authentication.initiateResponse({ // eslint-disable-line max-len
            tokenData: scannedValue,
            WIF: wif,
            did: did,
            claims: claimsArray
          })

          return backend.httpAgent.post(
            scannedValue.payload.callbackUrl,
            {token: token},
            { 'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            { credentials: 'include' }
          )
          .then((res) => {
            dispatch(router.pushRoute('wallet/identity'))
            return res
          })
        }))
      }
    }
  },
  getClaims: {
    expectedParams: ['claims'],
    async: true,
    creator: (params) => {
      return (dispatch, getState, {services, backend}) =>
        dispatch(actions.getClaims.buildAction(params, () =>
          Promise.all(params.claims.map(claim =>
            services.storage.getItem(claim)
          ))
        ))
    }
  },
  setSelectedClaim: {
    expectedParams: ['field', 'claimId'],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(actions.setSelectedClaim.buildAction(params))
        dispatch(simpleDialogActions.hideDialog())
      }
    }
  },
  denyAccess: {
    expectedParams: [],
    creator: (params) => {
      return (dispatch, getState) => {
        dispatch(router.pushRoute('wallet/identity'))
      }
    }
  },
  setDid: {
    expectedParams: ['did']
  }
})

const initialState = Immutable.fromJS({
  entity: {
    loading: false,
    name: 'SOME COMPANY',
    image: 'img/hover_board.jpg',
    infoComplete: false,
    claims: {},
    response: {},
    userDid: '',
    errorMsg: ''
  }
})

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actions.setInfoComplete.id:
      return state.mergeIn(['entity'], {
        infoComplete: true
      })

    case actions.getClaims.id:
      return state

    case actions.getClaims.id_success:
      const claims = _resolveClaims(action)
      return state.mergeIn(['entity'], {
        claims: claims
      })

    case actions.confirmAccess.id_fail:
      if (action.error.response !== undefined) {
        return state.mergeIn(['entity'], {
          errorMsg: 'SSO Error ' + action.error.response.statusText
        })
      } else {
        return state.mergeIn(['entity'], {
          errorMsg: 'SSO process not successful. Please try again.'
        })
      }

    case actions.confirmAccess.id:
      return state

    case actions.confirmAccess.id_success:
      return state.mergeIn(['entity'], {
        errorMsg: ''
      })

    case actions.getClaims.id_fail:
      return state

    case actions.setDid.id:
      return state.mergeIn(['entity'], {
        userDid: action.did
      })

    case actions.setSelectedClaim.id:
      return state.mergeDeep({
        entity: {
          response: {
            [action.field]: action.claimId
          }
        }
      })

    default:
      return state
  }
}

const _resolveClaims = (action) => {
  let claimsUser = {}
  action.claims.map((claimType, i) => {
    if (action.result[i] !== null && action.result[i] !== undefined) {
      claimsUser[claimType] = action.result[i]
    }
  })
  return claimsUser
}
