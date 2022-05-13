import { CredentialIssuer } from '@jolocom/sdk/js/credentials'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { AttributeI, AttrsState } from '~/modules/attributes/types'
import {
  AttributeTypes,
  BaseUICredential,
  ClaimKeys,
  DisplayCredential,
  DisplayCredentialDocument,
} from '~/types/credentials'
import { extractClaims, extractCredentialType } from '~/utils/dataMapping'

type CredentialKeys = 'credentials' | 'selfIssuedCredentials'

export const separateCredentialsAndAttributes = (
  allCredentials: SignedCredential[],
  did: string,
): Record<CredentialKeys, SignedCredential[]> => {
  let selfIssuedCredentials: SignedCredential[] = []
  let credentials: SignedCredential[] = []
  allCredentials.map((c) => {
    if (c.issuer === did) {
      selfIssuedCredentials = [...selfIssuedCredentials, c]
    } else {
      credentials = [...credentials, c]
    }
  })
  return { credentials, selfIssuedCredentials }
}

function mapToBaseUICredential(c: SignedCredential): BaseUICredential {
  const { id, issued, type, expires, subject, name } = c
  return {
    id,
    issued,
    // NOTE: beware we are only taking the second type, this might change in the future
    type: type[1],
    expires,
    subject,
    name,
  }
}

export async function mapCredentialsToDisplay(
  credentials: CredentialIssuer,
  c: SignedCredential,
): Promise<DisplayCredential> {
  const credentialType = await credentials.types.forCredential(c)
  const { display } = await credentials.display(c)

  // NOTE: using the properties from @CredentialType causes the values to be overwritten
  // by the last credential of the same @type & @issuer.
  const { issuerProfile } = credentialType
  const { properties } = display

  const uiCredential: DisplayCredential = {
    ...mapToBaseUICredential(c),
    issuer: issuerProfile, // NOTE: credentialType will returned resolved issuer
    properties: properties
      ? properties.map((p, idx) => ({
          key: p.key ? p.key.split('.')[1] : `${Date.now()}${idx}}`,
          label: p.label ?? '',
          value: p.value || '',
        }))
      : [],
  }

  return uiCredential
}

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
        .reduce((acc, v) => `${acc} ${v.value}`, '')
        .split(' ')
        .filter((e) => Boolean(e))
        .join(' ')
    : ''

  updatedProperties = updatedProperties.filter(
    (p) =>
      p.key !== ClaimKeys.givenName &&
      p.key !== ClaimKeys.familyName &&
      p.key !== ClaimKeys.photo,
  )

  return {
    ...credential,
    properties: updatedProperties,
    holderName,
    photo,
    highlight: credential.id,
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

export const sortCredentialsByRecentIssueDate = <T extends { issued: Date }>(
  credentials: T[],
): T[] => {
  return credentials.sort((a: T, b: T) => {
    const aMs = new Date(a.issued).getTime()
    const bMs = new Date(b.issued).getTime()
    if (aMs > bMs) {
      return -1
    } else {
      return 1
    }
  })
}

export function mapAttributesToDisplay(
  credentials: SignedCredential[],
): AttrsState<AttributeI> {
  return credentials.reduce((acc, cred) => {
    const type = extractCredentialType(cred) as AttributeTypes
    const entry = { id: cred.id, value: extractClaims(cred.claim) }
    const prevEntries = acc[type]

    acc[type] = prevEntries ? [...prevEntries, entry] : [entry]
    return acc
  }, {} as AttrsState<AttributeI>)
}
