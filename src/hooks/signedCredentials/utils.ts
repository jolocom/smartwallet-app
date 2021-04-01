import { Agent } from '@jolocom/sdk'
import { CredentialType } from '@jolocom/sdk/js/credentials'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { AttributeI, AttrsState } from '~/modules/attributes/types'
import { strings } from '~/translations'
import {
  AttributeTypes,
  BaseUICredential,
  ClaimKeys,
  DisplayCredential,
  DisplayCredentialDocument,
  DisplayCredentialOther,
  isDocument,
  DocumentTypes,
} from '~/types/credentials'
import { extractClaims, extractCredentialType } from '~/utils/dataMapping'
import { CredentialOfferRenderInfo } from 'jolocom-lib/js/interactionTokens/types'

type CredentialKeys = 'credentials' | 'selfIssuedCredentials'

export const getCredentialCategory = (renderInfo?: CredentialOfferRenderInfo) =>
  renderInfo?.renderAs === 'document'
    ? DocumentTypes.document
    : DocumentTypes.other

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
    type,
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
    category: getCredentialCategory(renderInfo),
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
