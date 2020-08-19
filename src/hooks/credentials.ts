import { useSDK } from './sdk'
import { useDispatch } from 'react-redux'
import { UICredential } from '~/types/credentials'
import { isCredentialAttribute } from '~/utils/dataMapping'

export const useSyncCredentials = () => {
  const sdk = useSDK()
  const dispatch = useDispatch()

  return async () => {
    const allCreds = await sdk.storageLib.get.verifiableCredential()

    const credentials = await allCreds.reduce<Promise<UICredential[]>>(
      async (accPromise, cred) => {
        const acc = await accPromise

        if (!isCredentialAttribute(cred)) {
          //FIXME: @issuer from @CredentialMetadata entity returns string, should
          // return @IdentitySummary
          const {
            renderInfo,
            //issuer,
          } = await sdk.storageLib.get.credentialMetadata(cred)
          const { name, expires, claim, issued, id, issuer: issuerDid } = cred
          const issuer = await sdk.storageLib.get.publicProfile(issuerDid)

          acc.push({
            id,
            claim,
            issuer,
            metadata: {
              name,
              expires,
              issued,
              renderInfo,
            },
          })
        }

        return acc
      },
      Promise.resolve([]),
    )

    // Sync credentials
  }
}
