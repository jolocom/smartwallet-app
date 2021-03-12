import { BaseMetadata } from "@jolocom/protocol-ts"
import { CredentialMetadataSummary } from "@jolocom/sdk"
import { CredentialDisplay } from "@jolocom/sdk/js/credentials"

export type CredentialKeys = 'credentials' | 'selfIssuedCredentials'

export type DisplayCredential = 
  & Required<Pick<CredentialMetadataSummary, 'type' | 'renderInfo' | 'issuer'>>
  & Pick<BaseMetadata, 'name'> 
  & Pick<CredentialDisplay['display'], 'properties'>
