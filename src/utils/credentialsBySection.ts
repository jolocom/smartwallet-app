import {
  CredentialsBySection,
  CredentialSection,
  BaseUICredential,
} from '~/types/credentials'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'


export const getCredentialsBySection = <T extends BaseUICredential>(
  creds: T[],
) => {
  return creds.reduce<CredentialsBySection<T>>(
    (acc, cred) => {
      const section = getCredentialSection(cred)
      acc[section] = [...acc[section], cred]

      return acc
    },
    { documents: [], other: [] },
  )
}

/**
 * Returns @CredentialSection based on the @renderAs property of the Credential Metadata
 */
export const getCredentialSection = <T extends BaseUICredential>(cred: T) =>
  cred.renderInfo && cred.renderInfo.renderAs === CredentialRenderTypes.document
    ? CredentialSection.Documents
    : CredentialSection.Other

