import { IdentitySummary } from '@jolocom/sdk'
import { CredentialIssuer } from '@jolocom/sdk/js/credentials'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { AttributeI, AttrsState } from '~/modules/attributes/types'
import { strings } from '~/translations'
import {
  AttributeTypes,
  BaseUICredential,
  ClaimKeys,
  CredentialsByType,
  CredentialsByIssuer,
  DisplayCredential,
  DisplayCredentialDocument,
  DisplayCredentialOther,
  isDocument,
  CredentialCategories,
  CredentialsByCategory,
  IdentificationTypes,
  TicketTypes,
} from '~/types/credentials'
import { extractClaims, extractCredentialType } from '~/utils/dataMapping'
import { CredentialOfferRenderInfo } from 'jolocom-lib/js/interactionTokens/types'

type CredentialKeys = 'credentials' | 'selfIssuedCredentials'

export const getCredentialCategory = (renderInfo?: CredentialOfferRenderInfo) =>
  renderInfo?.renderAs === 'document'
    ? CredentialCategories.document
    : CredentialCategories.other

// TODO: move to a different file
export const getCredentialUIType = (type: string) => {
  switch (type) {
    case IdentificationTypes.ProofOfIdCredentialDemo:
    case IdentificationTypes.ProofOfDriverLicenceDemo:
      return strings.IDENTIFICATION
    case TicketTypes.ProofOfTicketDemo:
      return strings.TICKET
    default:
      return strings.UNKNOWN
  }
}

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
  const { renderAs, issuerProfile } = credentialType
  const { properties } = display

  const uiCredential: DisplayCredential = {
    ...mapToBaseUICredential(c),
    issuer: issuerProfile, // NOTE: credentialType will returned resolved issuer
    category: getCredentialCategory({ renderAs }),
    properties: properties
      ? properties.map((p, idx) => ({
          key: p.key ? p.key.split('.')[1] : `${Date.now()}${idx}}`,
          label: p.label ?? strings.NOT_SPECIFIED,
          value: p.value || strings.NOT_SPECIFIED,
        }))
      : [],
  }

  return uiCredential
}

// TODO: this is so imperative
export function mapDisplayToCustomDisplay(
  credential: DisplayCredential,
): DisplayCredentialDocument | DisplayCredentialOther {
  const { properties } = credential
  let updatedProperties = properties.map((p) => ({
    ...p,
    key: p.key,
  }))

  if (isDocument(credential)) {
    const photo = updatedProperties.find(
      (p) => p.key === ClaimKeys.photo,
    )?.value
    const holderProperties = updatedProperties.filter(
      (p) => p.key === ClaimKeys.givenName || p.key === ClaimKeys.familyName,
    )
    const holderName = holderProperties.length
      ? holderProperties
          .reduce((acc, v) => `${acc} ${v.value}`, '')
          .split(' ')
          .filter((e) => Boolean(e))
          .join(' ')
      : strings.ANONYMOUS

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
  return {
    ...credential,
    properties: updatedProperties,
    photo: credential.issuer?.publicProfile?.image,
  }
}

/**
 * Maps credentials of type `DisplayCredential`
 * and transform into credentials of type `DisplayCredentialDocument | DisplayCredentialOther`
 *
 * Used to get custom display credentials:
 * * documents
 */
export const mapCredentialsToCustomDisplay = (
  credentials: DisplayCredential[],
): Array<DisplayCredentialDocument | DisplayCredentialOther> =>
  credentials.map(mapDisplayToCustomDisplay)

/**
 * Reduce categorized credentials to custom types `NT`
 * * `PT` - previous type
 * * `NT` - next type
 */
export const transformCategoriesTo = <PT>(cats: CredentialsByCategory<PT>) => {
  return <NT>(processFn: (categories: PT[]) => NT[]) => {
    return Object.keys(cats).reduce<CredentialsByCategory<NT>>(
      (categories, catName) => {
        const categoryName = catName as CredentialCategories
        categories[categoryName] = processFn(cats[categoryName])
        return categories
      },
      { [CredentialCategories.document]: [], [CredentialCategories.other]: [] },
    )
  }
}

/**
 * Groups credentials by type
 *
 * Used in:
 * * documents
 */
export const reduceCustomDisplayCredentialsByType = <
  T extends { type: string },
>(
  credentials: T[],
): Array<CredentialsByType<T>> => {
  return credentials.reduce(
    (groupedCredentials: Array<CredentialsByType<T>>, cred: T) => {
      const group = groupedCredentials.filter(
        (c) => c.value === getCredentialUIType(cred.type),
      )
      if (group.length) {
        groupedCredentials = groupedCredentials.map((g) => {
          if (g.value === group[0].value) {
            return { ...g, credentials: [...g.credentials, cred] }
          }
          return g
        })
      } else {
        groupedCredentials = [
          ...groupedCredentials,
          {
            key: 'type',
            value: getCredentialUIType(cred.type),
            credentials: [cred],
          },
        ]
      }
      return groupedCredentials
    },
    [],
  )
}

/**
 * Groups credentials by issuer
 *
 * Used in:
 * * documents
 */
export const reduceCustomDisplayCredentialsByIssuer = <
  T extends { issuer: IdentitySummary },
>(
  credentials: T[],
): Array<CredentialsByIssuer<T>> => {
  return credentials.reduce(
    (groupedCredentials: Array<CredentialsByIssuer<T>>, cred: T) => {
      const issuer = cred.issuer.publicProfile?.name ?? strings.UNKNOWN
      const group = groupedCredentials.filter((c) => c.value === issuer)
      if (group.length) {
        groupedCredentials = groupedCredentials.map((g) => {
          if (g.value === group[0].value) {
            return { ...g, credentials: [...g.credentials, cred] }
          }
          return g
        })
      } else {
        groupedCredentials = [
          ...groupedCredentials,
          { key: 'issuer', value: issuer, credentials: [cred] },
        ]
      }
      return groupedCredentials
    },
    [],
  )
}

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

export const reduceCustomDisplayCredentialsBySortedType = <
  T extends { type: string; issued: Date },
>(
  credentials: T[],
): Array<CredentialsByType<T>> => {
  return reduceCustomDisplayCredentialsByType(
    sortCredentialsByRecentIssueDate(credentials),
  )
}

export const reduceCustomDisplayCredentialsBySortedIssuer = <
  T extends { issuer: IdentitySummary; issued: Date },
>(
  credentials: T[],
): Array<CredentialsByIssuer<T>> => {
  return reduceCustomDisplayCredentialsByIssuer(
    sortCredentialsByRecentIssueDate(credentials),
  )
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
