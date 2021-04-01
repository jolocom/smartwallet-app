import { Agent, IdentitySummary } from '@jolocom/sdk'
import { CredentialType } from '@jolocom/sdk/js/credentials'
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
  OtherCategory,
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

export const reduceCustomDisplayCredentialsByType = <T extends {type: string}>(credentials: Array<CredentialsByType<T>>, cred: T) => {
  if(credentials.find(c => c.type === cred.type)) {
    credentials = credentials.map(c => {
      if(c.type === cred.type) {
        return {...c, credentials: [...c.credentials, cred]}
      }
      return c;
    })
  } else {
    credentials = [...credentials, {type: cred.type, credentials: [cred]}]
  }
  return credentials;
}

export const reduceCustomDisplayCredentialsByIssuer = <T extends {issuer: IdentitySummary}>(credentials: Array<CredentialsByIssuer<T>>, cred: T) => {
  const issuer = cred.issuer.publicProfile?.name ?? cred.issuer.did;
  if(credentials.find(c => c.value === issuer)) {
    credentials = credentials.map(c => {
      if(c.value === issuer) {
        return {...c, credentials: [...c.credentials, cred]}
      }
      return c;
    })
  } else {
    credentials = [...credentials, {key: 'issuer', value: issuer, credentials: [cred]}]
  }
  return credentials;
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
