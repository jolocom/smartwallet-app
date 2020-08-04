import { useDispatch, useSelector } from 'react-redux'
import { claimsMetadata } from 'cred-types-jolocom-core'

import { setAttrs, updateAttrs } from '~/modules/attributes/actions'
import {
  setInteractionAttributes,
  setInitialSelectedAttributes,
} from '~/modules/interaction/actions'
import { AttrKeys, ATTR_TYPES } from '~/types/attributes'
import { getAttributes } from '~/modules/attributes/selectors'
import { useSDK } from './sdk'
import { AttrsState, AttributeI } from '~/modules/attributes/types'
import {
  makeAttrEntry,
  CredentialI,
  getClaim,
  credentialSchemas,
} from '~/utils/dataMapping'
import { getDid } from '~/modules/account/selectors'

export const useGetAllAttributes = () => {
  const dispatch = useDispatch()
  const sdk = useSDK()
  const getAttributes = async () => {
    try {
      const verifiableCredentials = await sdk.storageLib.get.verifiableCredential()

      const attributes = verifiableCredentials.reduce<AttrsState<AttributeI>>(
        (acc, v) => {
          if (Object.values(credentialSchemas).indexOf(v.type[1]) > -1) {
            const attrType = v.type[1] as keyof typeof ATTR_TYPES
            const attrKey: AttrKeys = ATTR_TYPES[attrType]
            const entry = makeAttrEntry(attrKey, acc[attrKey], v as CredentialI)

            acc[attrKey] = entry
          }
          return acc
        },
        {},
      )

      dispatch(setAttrs(attributes))
      // dispatch(setCredentials(credentials));
    } catch (err) {
      console.warn('Failed getting verifiable credentials', err)
    }
  }

  return getAttributes
}

export const useSetInteractionAttributes = () => {
  const dispatch = useDispatch()
  const attributes = useSelector(getAttributes)
  const updateInteractionAttributes = () => {
    // this will happen on Credentail Share flow
    const requestedAttributes = [
      AttrKeys.mobilePhoneNumber,
      AttrKeys.emailAddress,
    ]
    const interactionAttributues = requestedAttributes.reduce((acc, v) => {
      const value = v as AttrKeys
      acc[v] = attributes[value] || []
      return acc
    }, {} as { [key: string]: AttributeI[] })
    dispatch(setInteractionAttributes(interactionAttributues))

    const selectedAttributes = Object.keys(interactionAttributues).reduce(
      (acc, v) => {
        const value = v as AttrKeys
        if (!acc[value]) {
          acc[value] = interactionAttributues[value].length
            ? interactionAttributues[value][0].id
            : ''
        }
        return acc
      },
      {} as { [key: string]: string },
    )
    dispatch(setInitialSelectedAttributes(selectedAttributes))
  }

  return updateInteractionAttributes
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

    // this one is done to map our custom fields names to the one in `cred-types-jolocom-core`
    const verifiableCredential = await sdk.identityWallet.create.signedCredential(
      {
        metadata: claimsMetadata[attributeKey],
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
