import { BaseMetadata } from "@jolocom/protocol-ts"
import { CredentialMetadataSummary } from "@jolocom/sdk"
import { CredentialDisplay } from "@jolocom/sdk/js/credentials"
import { SignedCredential } from "jolocom-lib/js/credentials/signedCredential/signedCredential"

export type CredentialKeys = 'credentials' | 'selfIssuedCredentials'

export type DisplayCredential = 
  & Required<Pick<CredentialMetadataSummary, 'type' | 'renderInfo' | 'issuer'>>
  & Pick<BaseMetadata, 'name'> 
  & Pick<CredentialDisplay['display'], 'properties'>

export function isCredentials(values: any): values is SignedCredential[] {
  const [val] = values;
  return val.id && val.issuer && val.type;
}
