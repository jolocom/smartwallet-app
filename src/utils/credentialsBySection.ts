import {
  CredentialSection,
  DisplayCredential,
} from '~/types/credentials'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'


// TODO: double check use of this function
/**
 * Returns @CredentialSection based on the @renderAs property of the Credential Metadata
 */
export const getCredentialSection = <T extends DisplayCredential>(cred: T) =>
  cred.category === CredentialRenderTypes.document
    ? CredentialSection.Documents
    : CredentialSection.Other
