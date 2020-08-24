import {
  UICredentialMetadata,
  CredentialsBySection,
  UICredential,
  CredentialSection,
} from '~/types/credentials'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'

export const getCredentialsBySection = <
  T extends { metadata: UICredentialMetadata }
>(
  creds: T[],
) => {
  return creds.reduce<CredentialsBySection<T>>(
    (acc, cred) => {
      if (
        cred.metadata.renderInfo &&
        cred.metadata.renderInfo.renderAs === CredentialRenderTypes.document
      ) {
        acc.documents = [...acc.documents, cred]
      } else {
        acc.other = [...acc.other, cred]
      }

      return acc
    },
    { documents: [], other: [] },
  )
}

/**
 * Returns @CredentialSection based on the @renderAs property of the Credential Metadata
 */
export const getCredentialSection = (cred: UICredential) =>
  cred.metadata.renderInfo &&
  cred.metadata.renderInfo.renderAs === CredentialRenderTypes.document
    ? CredentialSection.Documents
    : CredentialSection.Other
