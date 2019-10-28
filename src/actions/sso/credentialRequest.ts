import { unnest } from 'ramda'
import { getUiCredentialTypeByType } from '../../lib/util'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { Storage } from '../../lib/storage/storage'
import { ISignedCredentialAttrs } from 'jolocom-lib/js/credentials/signedCredential/types'
import {
  CredentialTypeSummary,
  CredentialVerificationSummary,
} from '../../utils/interactionRequests/types'

/**
 * @TODO - This function should not exist, instead we should have a more flexible
 *   api on the storage side.
 * Given a list of {@link CredentialVerificationSummary}, will use the provided
 * database adapter to fetch the listed credentials based on IDs
 * @param selectedCredentials - list of credentials to be fetched
 * @param storageLib - instance of a database adapter
 */

export const fetchCredentialsFromDatabase = async (
  selectedCredentials: CredentialVerificationSummary[],
  storageLib: Storage,
): Promise<ISignedCredentialAttrs[]> => {
  const toFetch = selectedCredentials.map(({ id }) => ({ id }))

  const signedCredentials = await Promise.all(
    toFetch.map(storageLib.get.verifiableCredential),
  )

  return unnest(signedCredentials).map(c => c.toJSON())
}

interface AttributeSummary {
  type: string[]
  results: Array<{
    verification: string
    fieldName: string
    values: string[]
  }>
}

/**
 * Given an array of credential types, returns them from the database.
 * In a specifically formatted way
 * @param requestedTypes
 * @param storageLib
 * @param did
 * @returns - Array of type credential type summaries
 */

export const fetchMatchingCredentials = async (
  requestedTypes: string[][],
  storageLib: Storage,
  did: string,
): Promise<CredentialTypeSummary[]> => {
  const attributesForType = await Promise.all<AttributeSummary>(
    requestedTypes.map(storageLib.get.attributesByType),
  )

  const populatedWithCredentials = await Promise.all(
    attributesForType.map(async ({ results, type }) => {
      if (!results.length) {
        return [
          {
            type: getUiCredentialTypeByType(type),
            values: [],
            verifications: [],
          },
        ]
      }
      return Promise.all(
        results.map(async ({ values, verification: id }) => ({
          type: getUiCredentialTypeByType(type),
          values,
          verifications: await storageLib.get.verifiableCredential({ id }),
        })),
      )
    }),
  )

  const abbreviated = populatedWithCredentials.map(attribute =>
    attribute.map(entry => ({
      ...entry,
      verifications: entry.verifications.map((vCred: SignedCredential) => ({
        id: vCred.id,
        issuer: {
          did: vCred.issuer,
        },
        selfSigned: vCred.signer.did === did,
        expires: vCred.expires,
      })),
    })),
  )

  return abbreviated.reduce((acc, val) => acc.concat(val))
}
