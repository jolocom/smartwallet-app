import { IClaimSection } from 'jolocom-lib/js/credentials/credential/types'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'

import {
  IAttributeClaimField,
  IAttributeClaimFieldWithValue,
} from '~/types/credentials'

import { IdentitySummary } from 'react-native-jolocom'
import { attributeConfig } from '~/config/claims'
import truncateDid from './truncateDid'

export const extractClaims = ({ id, ...claims }: IClaimSection) => claims

export const getCredentialType = (types: string[]) => types[types.length - 1]

export const extractCredentialType = <T extends { type: string[] }>(cred: T) =>
  getCredentialType(cred.type)

export const isTypeAttribute = (type: string) =>
  Object.keys(attributeConfig).includes(type)

export const isCredentialAttribute = (cred: SignedCredential, did: string) =>
  isTypeAttribute(extractCredentialType(cred)) && cred.issuer === did

export const isCredentialDocument = (cred: SignedCredential, did: string) =>
  !isCredentialAttribute(cred, did)

export const assembleFormInitialValues = (
  fields: Array<IAttributeClaimField | IAttributeClaimFieldWithValue>,
) =>
  fields.reduce<Record<string, string>>((acc, f) => {
    // @ts-expect-error
    acc[f.key] = f.value ?? ''
    return acc
  }, {})

export const getCounterpartyName = (counterparty?: IdentitySummary) =>
  counterparty === undefined
    ? ''
    : counterparty?.publicProfile?.name ?? truncateDid(counterparty.did)
