import { groupBy } from 'ramda'
import { CredentialEntity } from '@jolocom/sdk/js/src/lib/storage/entities'

/**
 * Given an array of Credential Entities, will attempt to group them by
 * the credential they are part of, and return a sumarry, contain a key name
 * and an array of aggregated values
 * @param credentials - Credential Entities to group. If all claims are part of different
 * credentials, the array is returned unmodified
 */

export const groupAttributesByCredentialId = (
  credentials: CredentialEntity[],
) => {
  /** @dev We get a number of credential entities. Each contains one claim. We first
   * group all entities part of the same credential together (i.e. given name, family name)
   */
  const groupedByCredential = Object.values(
    groupBy(
      (credential: CredentialEntity) => credential.verifiableCredential.id,
      credentials,
    ),
  )

  return groupedByCredential.map(credentials => ({
    ...credentials[0],
    propertyValue: credentials.map(cred => cred.propertyValue),
  }))
}
