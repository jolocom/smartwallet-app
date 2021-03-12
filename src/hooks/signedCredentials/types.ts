import { BaseMetadata } from "@jolocom/protocol-ts"
import { CredentialMetadataSummary } from "@jolocom/sdk"

export type CredentialKeys = 'credentials' | 'selfIssuedCredentials'

// TODO: remove when types on sdk are fixed
export interface  DisplayVal {
  key: string,
  label: string,
  value: string | number
}
export type DisplayCredential = 
  & {id: string, holderName?: string, photo?: string, properties: DisplayVal[]}
  & Required<Pick<CredentialMetadataSummary, 'type' | 'renderInfo' | 'issuer'>>
  & Pick<BaseMetadata, 'name'> 
