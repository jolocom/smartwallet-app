import {
  ClaimKeys,
  DisplayCredential,
  DisplayCredentialDocument,
} from '~/types/credentials'

// TODO: this is so imperative
export function mapDisplayToDocument(
  credential: DisplayCredential,
): DisplayCredentialDocument {
  const { properties } = credential
  let updatedProperties = properties.map((p) => ({
    ...p,
    key: p.key,
  }))

  const photo = updatedProperties.find((p) => p.key === ClaimKeys.photo)?.value
  const holderProperties = updatedProperties.filter(
    (p) => p.key === ClaimKeys.givenName || p.key === ClaimKeys.familyName,
  )
  const holderName = holderProperties.length
    ? holderProperties
        .reduce((acc, v) => `${acc} ${v.value ?? ''}`, '')
        .split(' ')
        .filter((e) => Boolean(e))
        .join(' ')
    : undefined

  updatedProperties = updatedProperties.filter(
    (p) =>
      p.key !== ClaimKeys.givenName &&
      p.key !== ClaimKeys.familyName &&
      p.key !== ClaimKeys.photo,
  )

  const previewKeys = updatedProperties
    .filter((p) => p.preview === true)
    .map((p) => p.key!)

  let icons = []

  return {
    ...credential,
    properties: updatedProperties,
    holderName,
    previewKeys,
    photo: photo?.trim(),
  }
}

/**
 * Maps credentials of type `DisplayCredential`
 * and transform into credentials of type `DisplayCredentialDocument | DisplayCredentialOther`
 *
 * Used to get custom display credentials:
 * * documents
 */
export const mapDisplayToDocuments = (
  credentials: DisplayCredential[],
): Array<DisplayCredentialDocument> => credentials.map(mapDisplayToDocument)
