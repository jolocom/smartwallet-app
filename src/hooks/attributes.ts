import { useDispatch, useSelector } from 'react-redux'
import { setAttrs, updateAttrs } from '~/modules/attributes/actions'
import {
  setInteractionAttributes,
  setInitialSelectedAttributes,
} from '~/modules/interaction/actions'
import { AttrKeys, AttrTypes } from '~/types/attributes'
import { getAttributes } from '~/modules/attributes/selectors'
import { useSDK } from './sdk'
import { AttrsState, AttributeI } from '~/modules/attributes/types'
import { makeAttrEntry } from '~/utils/dataMapping'
import { CredentialI } from '~/utils/dataMapping'

const ATTR_TYPES = {
  ProofOfEmailCredential: AttrKeys.email,
  ProofOfMobilePhoneNumberCredential: AttrKeys.number,
  ProofOfNameCredential: AttrKeys.name,
}

export const useGetAllAttributes = () => {
  const dispatch = useDispatch()
  const sdk = useSDK()
  const getAttributes = async () => {
    try {
      const verifiableCredentials = await sdk.bemw.storageLib.get.verifiableCredential()
      const attributes = verifiableCredentials.reduce((acc, v) => {
        if (v.type[1] in AttrTypes) {
          const attrType = v.type[1] as AttrTypes
          const attrKey: AttrKeys = ATTR_TYPES[attrType]
          const entry = makeAttrEntry(attrKey, acc[attrKey], v as CredentialI)

          acc[attrKey] = entry
        }
        return acc
      }, {} as AttrsState<AttributeI>)

      dispatch(setAttrs(attributes))
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
    const requestedAttributes = ['number', 'email']
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

const getId = () => '_' + Math.random().toString(36).substr(2, 9)
export const useCreateAttributes = () => {
  const dispatch = useDispatch()
  const createSelfIssuedCredential = async (
    attributeKey: AttrKeys,
    value: string,
  ) => {
    const id = getId()
    const attribute = { id, value }
    dispatch(updateAttrs({ attributeKey, attribute }))
  }

  return {
    addEmail: () =>
      createSelfIssuedCredential(AttrKeys.email, 'johns@example.com'),
    addName: () => createSelfIssuedCredential(AttrKeys.name, 'John Smith'),
  }
}
