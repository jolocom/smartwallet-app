import {
  CredentialEntity,
  MasterKeyEntity,
  PersonaEntity,
  SignatureEntity,
  VerifiableCredentialEntity,
} from '.'

export { CredentialEntity } from './credentialEntity'
export { MasterKeyEntity } from './masterKeyEntity'
export { PersonaEntity } from './personaEntity'
export { SignatureEntity } from './signatureEntity'
export { VerifiableCredentialEntity } from './verifiableCredentialEntity'

export const entityList = [
  CredentialEntity,
  MasterKeyEntity,
  PersonaEntity,
  SignatureEntity,
  VerifiableCredentialEntity,
]
