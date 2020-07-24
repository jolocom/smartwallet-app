import { useDispatch, useSelector } from 'react-redux'
import { setAttrs, updateAttrs } from '~/modules/attributes/actions'
import {
  setInteractionAttributes,
  setInitialSelectedAttributes,
} from '~/modules/interaction/actions'
import { AttrKeys } from '~/types/attributes'
import { getAttributes } from '~/modules/attributes/selectors'
import { useSDK } from './sdk'
import { AttrsState, AttributeI } from '~/modules/attributes/types'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { Credential } from 'jolocom-lib/js/credentials/credential/credential'

enum AttrTypes {
  ProofOfEmailCredential = 'ProofOfEmailCredential',
  ProofOfMobilePhoneNumberCredential = 'ProofOfMobilePhoneNumberCredential',
  ProofOfNameCredential = 'ProofOfNameCredential',
}

const ATTR_TYPES = {
  ProofOfEmailCredential: AttrKeys.email,
  ProofOfMobilePhoneNumberCredential: AttrKeys.number,
  ProofOfNameCredential: AttrKeys.name,
}

type InitialEntryValueT = undefined | AttributeI[]
interface CredentialI {
  id: string
  claim: {
    [key: string]: string
  }
}

const makeAttrEntry = (
  attrKey: AttrKeys,
  initialValue: InitialEntryValueT,
  v: CredentialI,
) => {
  let entry: AttributeI = { id: v.id, value: '' }
  if (attrKey === AttrKeys.name) {
    entry.value = `${v.claim.givenName} ${v.claim.familyName}`
  } else if (attrKey === AttrKeys.email) {
    entry.value = v.claim.email
  } else if (attrKey === AttrKeys.number) {
    entry.value = v.claim.number
  }

  return Array.isArray(initialValue) ? [...initialValue, entry] : [entry]
}

export const useGetAllAttributes = () => {
  const dispatch = useDispatch()
  const sdk = useSDK()
  const getAttributes = async () => {
    try {
      const verifiableCredentials = await sdk.bemw.storageLib.get.verifiableCredential()
      const attributes = verifiableCredentials.reduce((acc, v) => {
        if (
          v.type[1] === AttrTypes.ProofOfNameCredential ||
          v.type[1] === AttrTypes.ProofOfMobilePhoneNumberCredential ||
          v.type[1] === AttrTypes.ProofOfEmailCredential
        ) {
          const attrType = v.type[1] as AttrTypes
          const attrKey: AttrKeys = ATTR_TYPES[attrType]
          const entry = makeAttrEntry(attrKey, acc[attrKey], v)

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
      acc[v] = attributes[v] || []
      return acc
    }, {})
    dispatch(setInteractionAttributes(interactionAttributues))

    const selectedAttributes = Object.keys(interactionAttributues).reduce(
      (acc, v) => {
        if (!acc[v]) {
          acc[v] = interactionAttributues[v].length
            ? interactionAttributues[v][0].id
            : ''
        }
        return acc
      },
      {},
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
