import { OtherCategory } from '~/types/credentials'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { CredentialCategory } from '~/types/credentials'

export const getCredentialCategory = <
  T extends { category: CredentialCategory }
>(
  cred: T,
) =>
  cred.category === CredentialRenderTypes.document
    ? CredentialRenderTypes.document
    : OtherCategory.other
