// TODO rework
// Multiple credentials of the same type, i.e. ['Credential', 'ProofOfNameCredential']
import {
  CredentialEntity,
  VerifiableCredentialEntity,
} from './entities'

interface ModifiedCredentialEntity {
  propertyName: string
  propertyValue: string[]
  verifiableCredential: VerifiableCredentialEntity
}

export const groupAttributesByCredentialId = (
  credentials: CredentialEntity[],
): ModifiedCredentialEntity[] => {
  // Convert values to arrays for easier concatination later
  const modifiedAttributes = credentials.map(credential => ({
    ...credential,
    propertyValue: [credential.propertyValue], // "eugeniu@jolocom.com" -> ["eugeniu@jolocom.com"]
  }))

  // Helper function
  const findByCredId = (
    arrToSearch: ModifiedCredentialEntity[],
    value: ModifiedCredentialEntity,
  ) =>
    arrToSearch.findIndex(
      entry => entry.verifiableCredential.id === value.verifiableCredential.id,
    )

  debugger
  return modifiedAttributes.reduce(
    (acc: ModifiedCredentialEntity[], curr: ModifiedCredentialEntity) => {
      const matchingIndex = findByCredId(acc, curr)

      // This seems to be a hack, uniting individual claims from the credential back together
      if (matchingIndex >= 0) {
        acc[matchingIndex].propertyValue = [
          ...acc[matchingIndex].propertyValue,
          ...curr.propertyValue,
        ]
        return acc
      } else {
        return [...acc, curr]
      }
    },
    [],
  )
}
