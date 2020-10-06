import { useDispatch, useSelector } from 'react-redux'
import { claimsMetadata } from 'cred-types-jolocom-core'

import { setAttrs, updateAttrs } from '~/modules/attributes/actions'
import { AttrKeys, ATTR_TYPES } from '~/types/credentials'
import { useSDK } from './sdk'
import { AttrsState, AttributeI } from '~/modules/attributes/types'
import {
  makeAttrEntry,
  CredentialI,
  getClaim,
  isCredentialAttribute,
} from '~/utils/dataMapping'
import { getDid } from '~/modules/account/selectors'

export const useSyncStorageAttributes = () => {
  const dispatch = useDispatch()
  const sdk = useSDK()

  return async () => {
    try {
      const verifiableCredentials = await sdk.storageLib.get.verifiableCredential()

      const attributes = verifiableCredentials.reduce<AttrsState<AttributeI>>(
        (acc, v) => {
          if (isCredentialAttribute(v)) {
            const attrType = v.type[1] as keyof typeof ATTR_TYPES
            const attrKey: AttrKeys = ATTR_TYPES[attrType]
            //FIXME type assertion
            const entry = makeAttrEntry(attrKey, acc[attrKey], v as CredentialI)

            acc[attrKey] = entry
          }
          return acc
        },
        {},
      )

      dispatch(setAttrs(attributes))
    } catch (err) {
      console.warn('Failed getting verifiable credentials', err)
    }
  }
}

export const useCreateAttributes = () => {
  const sdk = useSDK()
  const did = useSelector(getDid)
  const dispatch = useDispatch()

  const createSelfIssuedCredential = async (
    attributeKey: AttrKeys,
    value: string,
  ) => {
    const password = await sdk.keyChainLib.getPassword()
    const metadata = claimsMetadata[attributeKey]
    if (!metadata) throw new Error('Attribute key is not supported')

    // this one is done to map our custom fields names to the one in `cred-types-jolocom-core`
    const verifiableCredential = await sdk.identityWallet.create.signedCredential(
      {
        metadata,
        claim: getClaim(attributeKey, value), // this will split claims and create an object with properties it should have
        subject: did,
      },
      password,
    )
    const entry = makeAttrEntry(
      attributeKey,
      undefined,
      verifiableCredential as CredentialI,
    )

    // save it in the storage
    await sdk.storageLib.store.verifiableCredential(verifiableCredential)

    dispatch(updateAttrs({ attributeKey, attribute: entry[0] }))
  }

  return createSelfIssuedCredential
}
