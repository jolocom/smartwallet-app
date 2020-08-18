import Keychain from 'react-native-keychain'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { groupBy, map, mergeRight, omit, uniq, zipWith } from 'ramda'

import { PIN_SERVICE } from 'src/ui/deviceauth/utils/keychainConsts'
import { navigationActions, accountActions } from 'src/actions/'

import { routeList } from 'src/routeList'
import { CategorizedClaims, DecoratedClaims } from 'src/reducers/account'
import {
  getClaimMetadataByCredentialType,
  getCredentialUiCategory,
  getUiCredentialTypeByType,
} from 'src/lib/util'
import { ThunkAction } from 'src/store'
import { compose } from 'redux'
import { CredentialMetadataSummary } from '../../lib/storage/storage'
import { IdentitySummary } from '../sso/types'
import { Not } from 'typeorm'
import { HAS_EXTERNAL_CREDENTIALS } from './actionTypes'
import { BackendError } from '../../lib/errors/types'

export const setDid = (did: string) => ({
  type: 'DID_SET',
  value: did,
})

export const setLocalAuth = () => ({
  type: 'SET_LOCAL_AUTH',
})

export const openLocalAuth = () => ({
  type: 'OPEN_LOCAL_AUTH',
})

export const closeLocalAuth = () => ({
  type: 'CLOSE_LOCAL_AUTH',
})

export const setSelected = (claim: DecoratedClaims) => ({
  type: 'SET_SELECTED',
  selected: claim,
})

export const setPopup = (value: boolean) => ({
  type: 'SET_POPUP',
  payload: value,
})

export const lockApp = () => ({
  type: 'LOCK_APP',
})

export const unlockApp = () => ({
  type: 'UNLOCK_APP',
})

export const closeLock = () => ({
  type: 'CLOSE_LOCK',
})

export const openLock = () => ({
  type: 'OPEN_LOCK',
})

export const closePINinstructions = () => ({
  type: 'CLOSE_PIN_INSTRICTIONS',
})

export const openPINinstructions = () => ({
  type: 'OPEN_PIN_INSTRICTIONS',
})

export const resetSelected = () => ({
  type: 'RESET_SELECTED',
})

export const handleClaimInput = (fieldValue: string, fieldName: string) => ({
  type: 'HANDLE_CLAIM_INPUT',
  fieldName,
  fieldValue,
})

export const checkIdentityExists: ThunkAction = async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  try {
    const identityWallet = await backendMiddleware.prepareIdentityWallet()
    const userDid = identityWallet.identity.did
    dispatch(setDid(userDid))
    return dispatch(navigationActions.navigate({ routeName: routeList.Home }))
  } catch (err) {
    if (!(err instanceof BackendError)) throw err

    if (err.message === BackendError.codes.NoEntropy) {
      // No seed in database, user must register
      // But check if a registration was already in progress
      const isRegistering = getState().registration.loading.isRegistering

      const routeName = isRegistering
        ? routeList.RegistrationProgress
        : routeList.Landing

      return dispatch(navigationActions.navigate({ routeName }))
    }
  }
}

export const checkLocalDeviceAuthSet: ThunkAction = async dispatch => {
  const pin = await Keychain.getGenericPassword({
    service: PIN_SERVICE,
  })
  if (pin) {
    dispatch(accountActions.setLocalAuth())
  } else {
    dispatch(accountActions.openLocalAuth())
  }
}

export const openClaimDetails = (
  claim: DecoratedClaims,
): ThunkAction => dispatch => {
  dispatch(setSelected(claim))
  return dispatch(
    navigationActions.navigate({
      routeName: routeList.ClaimDetails,
    }),
  )
}

export const saveClaim: ThunkAction = async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  const { identityWallet, storageLib, keyChainLib } = backendMiddleware

  const did = getState().account.did.did
  const claimsItem = getState().account.claims.selected
  const password = await keyChainLib.getPassword()

  const verifiableCredential = await identityWallet.create.signedCredential(
    {
      metadata: getClaimMetadataByCredentialType(claimsItem.credentialType),
      // the library acts directly on the object passed in, so a copy should be made first
      claim: { ...claimsItem.claimData },
      subject: did,
    },
    password,
  )

  if (claimsItem.id) {
    await storageLib.delete.verifiableCredential(claimsItem.id)
  }

  await storageLib.store.verifiableCredential(verifiableCredential)

  await dispatch(setClaimsForDid)

  return dispatch(navigationActions.navigatorResetHome())
}

export const toggleLoading = (value: boolean) => ({
  type: 'SET_LOADING',
  value,
})

export const hasExternalCredentials: ThunkAction = async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  const { storageLib, identityWallet } = backendMiddleware
  const externalCredentials = await storageLib.get.verifiableCredential({
    issuer: Not(identityWallet.did),
  })

  return dispatch({
    type: HAS_EXTERNAL_CREDENTIALS,
    value: externalCredentials.length !== 0,
  })
}
export const setClaimsForDid: ThunkAction = async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  const { storageLib } = backendMiddleware

  const verifiableCredentials: SignedCredential[] = await storageLib.get.verifiableCredential()

  const metadata = await Promise.all(
    verifiableCredentials.map(el => storageLib.get.credentialMetadata(el)),
  )

  const issuers = uniq(verifiableCredentials.map(cred => cred.issuer))

  const issuerMetadata = await Promise.all(
    issuers.map(storageLib.get.publicProfile),
  )

  const claims = prepareClaimsForState(
    verifiableCredentials,
    metadata,
    issuerMetadata,
  ) as CategorizedClaims

  return dispatch({
    type: 'SET_CLAIMS_FOR_DID',
    claims,
  })
}

export const prepareClaimsForState = (
  credentials: SignedCredential[],
  credentialMetadata: Array<CredentialMetadataSummary | {}>,
  issuerMetadata: IdentitySummary[],
) =>
  compose(
    groupBy(getCredentialUiCategory),
    zipWith(mergeRight, credentialMetadata),
    map(addIssuerInfo(issuerMetadata)),
    map(convertToDecoratedClaim),
  )(credentials)

export const addIssuerInfo = (issuerProfiles: IdentitySummary[]) => (
  claim: DecoratedClaims,
) => {
  if (!issuerProfiles || !issuerProfiles.length) {
    return claim
  }

  const issuer = issuerProfiles.find(el => el.did === claim.issuer.did)

  return issuer
    ? {
        ...claim,
        issuer,
      }
    : claim
}

/** @TODO Util, make subject mandatory (in lib) */
export const convertToDecoratedClaim = ({
  claim,
  type,
  issuer: issuerDid,
  id,
  expires,
}: SignedCredential): DecoratedClaims => ({
  credentialType: getUiCredentialTypeByType(type),
  issuer: {
    did: issuerDid,
  },
  claimData: omit(['id'], claim),
  id,
  subject: claim.id || 'Not found',
  expires: expires || undefined,
})
