import {
  DisplayCredential,
  OtherCategory,
} from '~/types/credentials'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'

export const getCredentialCategory = (cred: DisplayCredential) =>
  cred.category === CredentialRenderTypes.document
    ? CredentialRenderTypes.document
    : OtherCategory.other
