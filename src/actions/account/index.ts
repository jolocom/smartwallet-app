import { navigationActions } from 'src/actions/'
import { routeList } from 'src/routeList'
import { DecoratedClaims, CategorizedClaims } from 'src/reducers/account'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import {
  getClaimMetadataByCredentialType,
  getCredentialUiCategory,
  getUiCredentialTypeByType,
} from '../../lib/util'
import { cancelReceiving } from '../sso'
import { JolocomLib } from 'jolocom-lib'
import { ThunkDispatch as OriginalThunkDispatch} from 'redux-thunk'
import { groupBy, zipWith, mergeRight } from 'ramda'
import {AnyAction, compose} from 'redux'
import { CredentialMetadataSummary } from '../../lib/storage/storage'
import { RootState } from '../../reducers'
import { BackendMiddleware } from '../../backendMiddleware'

type ThunkDispatch = OriginalThunkDispatch <RootState, BackendMiddleware, AnyAction>

export const setDid = (did: string) => ({
  type: 'DID_SET',
  value: did,
})

export const setSelected = (claim: DecoratedClaims) => ({
  type: 'SET_SELECTED',
  selected: claim,
})

export const resetSelected = () => ({
  type: 'RESET_SELECTED',
})

export const handleClaimInput = (fieldValue: string, fieldName: string) => ({
  type: 'HANDLE_CLAIM_INPUT',
  fieldName,
  fieldValue,
})

export const toggleClaimsLoading = (value: boolean) => ({
  type: 'TOGGLE_CLAIMS_LOADING',
  value,
})

export const checkIdentityExists = async (
  dispatch: ThunkDispatch,
  getState: () => RootState,
  backendMiddleware: BackendMiddleware,
) => {
  dispatch(toggleClaimsLoading(true))
  const { keyChainLib, storageLib, encryptionLib } = backendMiddleware
  const encryptedEntropy = await storageLib.get.encryptedSeed().catch(err => {
    // TODO Fix this
    if (err.message.indexOf('no such table') === 0) {
      return
    }
  })

  if (!encryptedEntropy) {
    return dispatch(
      navigationActions.navigatorReset({ routeName: routeList.Landing }),
    )
  }

  const password = await keyChainLib.getPassword()

  const decryptedSeed = encryptionLib.decryptWithPass({
    cipher: encryptedEntropy,
    pass: password,
  })

  if (!decryptedSeed) {
    throw new Error('could not decrypt seed')
  }

  // TODO: rework the seed param on lib, currently cleartext seed is being passed around. Bad.
  const userVault = JolocomLib.KeyProvider.fromSeed(
    Buffer.from(decryptedSeed, 'hex'),
    password,
  )

  await backendMiddleware.setIdentityWallet(userVault, password)
  const identityWallet = backendMiddleware.identityWallet
  dispatch(setDid(identityWallet.identity.did))

  return dispatch(
    navigationActions.navigatorReset({ routeName: routeList.Home }),
  )
}

export const openClaimDetails = (claim: DecoratedClaims) => (
  dispatch: ThunkDispatch,
) => {
  dispatch(setSelected(claim))
  return dispatch(
    navigationActions.navigate({
      routeName: routeList.ClaimDetails,
    }),
  )
}

export const saveClaim = async (
  dispatch: ThunkDispatch,
  getState: () => RootState,
  backendMiddleware: BackendMiddleware,
) => {
  const { identityWallet, storageLib, keyChainLib } = backendMiddleware

  const did = getState().account.did.did
  const claimsItem = getState().account.claims.selected
  const password = await keyChainLib.getPassword()

  const verifiableCredential = await identityWallet.create.signedCredential(
    {
      metadata: getClaimMetadataByCredentialType(claimsItem.credentialType),
      claim: claimsItem.claimData,
      subject: did,
    },
    password,
  )

  if (claimsItem.id) {
    await storageLib.delete.verifiableCredential(claimsItem.id)
  }

  await storageLib.store.verifiableCredential(verifiableCredential)

  await dispatch(setClaimsForDid)

  return dispatch(
    navigationActions.navigatorReset({
      routeName: routeList.Home,
    }),
  )
}

// TODO Currently only rendering  / adding one
export const saveExternalCredentials = async (
  dispatch: ThunkDispatch,
  getState: () => RootState,
  backendMiddleware: BackendMiddleware,
) => {
  const { storageLib } = backendMiddleware
  const externalCredentials = getState().account.claims.pendingExternal
  const cred: SignedCredential = externalCredentials[0]

  if (cred.id) {
    await storageLib.delete.verifiableCredential(cred.id)
  }

  await storageLib.store.verifiableCredential(externalCredentials[0])
  return dispatch(cancelReceiving)
}

export const toggleLoading = (value: boolean) => ({
  type: 'SET_LOADING',
  value,
})

export const setClaimsForDid = async (
  dispatch: ThunkDispatch,
  getState: () => RootState,
  backendMiddleware: BackendMiddleware,
) => {
  const { storageLib } = backendMiddleware

  const verifiableCredentials: SignedCredential[] = await storageLib.get.verifiableCredential()
  const credentialMetadata: CredentialMetadataSummary[] = await Promise.all(
    verifiableCredentials.map(storageLib.get.credentialMetadata),
  )

  const claims = prepareClaimsForState(
    verifiableCredentials,
    credentialMetadata,
  ) as CategorizedClaims

  return dispatch({
    type: 'SET_CLAIMS_FOR_DID',
    claims,
  })
}

const prepareClaimsForState = (
  credentials: SignedCredential[],
  credentialMetadata: CredentialMetadataSummary[],
) =>
  compose(
    groupBy(getCredentialUiCategory),
    zipWith(mergeRight, credentialMetadata),
    convertToDecoratedClaim,
  )(credentials)

// TODO Util, make subject mandatory
export const convertToDecoratedClaim = (
  vCreds: SignedCredential[],
): DecoratedClaims[] =>
  vCreds.map(vCred => {
    const claimData = { ...vCred.claim }
    delete claimData.id

    return {
      credentialType: getUiCredentialTypeByType(vCred.type),
      claimData,
      id: vCred.id,
      issuer: vCred.issuer,
      subject: vCred.claim.id || 'Not found',
      expires: vCred.expires || undefined,
    }
  })
