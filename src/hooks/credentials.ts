import { useSDK } from './sdk'
import { useDispatch } from 'react-redux'
import { UICredential } from '~/types/credentials'
import { isCredentialAttribute } from '~/utils/dataMapping'
import { setCredentials } from '~/modules/credentials/actions'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'

/**
 * Used for mapping and syncing credentials with the SDK storage. Currently no CRUD
 * operations with the credentials module (e.g. after a credential offer. not
 * syncing with the storage, but adding the new mapped @UICredential(s) to the store).
 */
export const useSyncStorageCredentials = () => {
  const sdk = useSDK()
  const dispatch = useDispatch()

  const credentialToUICredential = async (
    cred: SignedCredential,
  ): Promise<UICredential> => {
    //FIXME: @issuer from @CredentialMetadata entity returns string, should
    // return @IdentitySummary
    const {
      renderInfo,
      //issuer,
    } = await sdk.storageLib.get.credentialMetadata(cred)
    const {
      name,
      expires,
      claim,
      issued,
      id,
      issuer: issuerDid,
      type: typeArr,
    } = cred
    const issuer = await sdk.storageLib.get.publicProfile(issuerDid)
    const type = typeArr[typeArr.length - 1]

    return {
      id,
      type,
      claim,
      issuer,
      renderInfo,
      metadata: {
        name,
        expires,
        issued,
      },
    }
  }

  return async () => {
    const allCreds = await sdk.storageLib.get.verifiableCredential()

    const credentials = await allCreds.reduce<Promise<UICredential[]>>(
      async (accPromise, cred) => {
        const acc = await accPromise

        if (!isCredentialAttribute(cred)) {
          const uiCredential = await credentialToUICredential(cred)
          acc.push(uiCredential)
        }

        return acc
      },
      Promise.resolve([]),
    )

    dispatch(setCredentials(credentials))
  }
}
