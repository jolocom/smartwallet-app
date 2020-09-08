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
export const useSyncCredentials = () => {
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
    const { name, expires, claim, issued, id, issuer: issuerDid } = cred
    const issuer = await sdk.storageLib.get.publicProfile(issuerDid)

    return {
      id,
      claim,
      issuer,
      metadata: {
        name,
        expires,
        issued,
        renderInfo,
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
