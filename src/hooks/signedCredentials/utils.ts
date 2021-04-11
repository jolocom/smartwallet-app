import { Agent, IdentitySummary } from '@jolocom/sdk'
import { CredentialType } from '@jolocom/sdk/js/credentials'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/types'
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
  OtherCategory,
  CredentialsByCategory,
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
  const { id, issuer, issued, type, expires, subject, name } = c
  return {
    id,
    issuer,
    issued,
    // NOTE: beware we are only taking the second type, this might change in the future
    type: type[1],
    expires,
    subject,
    name,
  }
}

export async function mapCredentialsToDisplay(
  agent: Agent,
  c: SignedCredential,
): Promise<DisplayCredential> {
  const metadata = await agent.storage.get.credentialMetadata(c)
  const resolvedIssuer = await agent.storage.get.publicProfile(c.issuer)

  // @ts-expect-error - until types are corrected in sdk
  const { type, renderInfo, credential } = metadata
  const baseUICredentials = mapToBaseUICredential(c)
  let updatedCredentials: DisplayCredential = {
    ...baseUICredentials,
    issuer: resolvedIssuer,
    category: renderInfo?.renderAs ?? OtherCategory.other,
    properties: [],
  }

  if (credential) {
    const credType = new CredentialType(type, credential)
    const {
      name,
      display: { properties },
    } = credType.display(c.claim)
    updatedCredentials = {
      ...updatedCredentials,
      name,
      properties: properties.map((p, idx) => ({
        key: p.key ?? `${Date.now()}${idx}}`,
        label: p.label ?? strings.NOT_SPECIFIED,
        value: p.value || strings.NOT_SPECIFIED,
      })),
    }
  }
  return updatedCredentials
}

// TODO: this is so imperative
export function mapDisplayToCustomDisplay(
  credential: DisplayCredential,
): DisplayCredentialDocument | DisplayCredentialOther {
  const { properties } = credential
  let updatedProperties = properties.map((p) => ({
    ...p,
    key: p.key?.split('.')[1],
  }))

  if (isDocument(credential)) {
    const photo = updatedProperties.find((p) => p.key === ClaimKeys.photo)
      ?.value
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
    photo: credential.issuer.publicProfile?.image,
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
        const categoryName = catName as
          | CredentialRenderTypes.document
          | OtherCategory.other
        categories[categoryName] = processFn(cats[categoryName])
        return categories
      },
      { [CredentialRenderTypes.document]: [], [OtherCategory.other]: [] },
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
  T extends { type: string }
>(
  credentials: T[],
): Array<CredentialsByType<T>> => {
  return credentials.reduce(
    (groupedCredentials: Array<CredentialsByType<T>>, cred: T) => {
      if (groupedCredentials.find((c) => c.value === cred.type)) {
        groupedCredentials = groupedCredentials.map((c) => {
          if (c.value === cred.type) {
            return { ...c, credentials: [...c.credentials, cred] }
          }
          return c
        })
      } else {
        groupedCredentials = [
          ...groupedCredentials,
          { key: 'type', value: cred.type, credentials: [cred] },
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
  T extends { issuer: IdentitySummary }
>(
  credentials: T[],
): Array<CredentialsByIssuer<T>> => {
  return credentials.reduce(
    (groupedCredentials: Array<CredentialsByIssuer<T>>, cred: T) => {
      const issuer = cred.issuer.publicProfile?.name ?? cred.issuer.did
      if (groupedCredentials.find((c) => c.value === issuer)) {
        groupedCredentials = groupedCredentials.map((c) => {
          if (c.value === issuer) {
            return { ...c, credentials: [...c.credentials, cred] }
          }
          return c
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

export const sortCredentialsByRecentIssueDate = <T extends {issued: Date}>(credentials: T[]): T[] => {
  return credentials.sort((a: T, b: T) => {
    const aMs = new Date(a.issued).getTime();
    const bMs = new Date(b.issued).getTime();
    if(aMs > bMs) {
      return -1
    } else {
      return 1;
    }
  })
}

export const reduceCustomDisplayCredentialsBySortedType = <T extends {type: string, issued: Date}>(credentials: T[]): Array<CredentialsByType<T>> => {
  return reduceCustomDisplayCredentialsByType(sortCredentialsByRecentIssueDate(credentials));
}

export const reduceCustomDisplayCredentialsBySortedIssuer = <T extends {issuer: IdentitySummary, issued: Date}>(credentials: T[]): Array<CredentialsByIssuer<T>> => {
  return reduceCustomDisplayCredentialsByIssuer(sortCredentialsByRecentIssueDate(credentials));
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
