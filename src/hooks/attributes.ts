import { useDispatch, useSelector } from 'react-redux'

import { editAttr, initAttrs, updateAttrs } from '~/modules/attributes/actions'
import { AttributeTypes, IAttributeConfig } from '~/types/credentials'
import { useAgent } from './sdk'
import { AttrsState, AttributeI, ClaimValues } from '~/modules/attributes/types'
import {
  isCredentialAttribute,
  extractCredentialType,
  extractClaims,
} from '~/utils/dataMapping'
import { getDid } from '~/modules/account/selectors'
import { attributeConfig } from '~/config/claims'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'

export const useSyncStorageAttributes = () => {
  const dispatch = useDispatch()
  const agent = useAgent()

  return async () => {
    try {
      const verifiableCredentials = await agent.storage.get.verifiableCredential()

      const attributes = verifiableCredentials.reduce<AttrsState<AttributeI>>(
        (acc, cred) => {
          if (isCredentialAttribute(cred, agent.idw.did)) {
            const type = extractCredentialType(cred) as AttributeTypes
            const entry = { id: cred.id, value: extractClaims(cred.claim) }
            const prevEntries = acc[type]

            acc[type] = prevEntries ? [...prevEntries, entry] : [entry]
          }
          return acc
        },
        {},
      )

      dispatch(initAttrs(attributes))
    } catch (err) {
      console.warn('Failed getting verifiable credentials', err)
    }
  }
}

const formAttribute = (signedCredential: SignedCredential) => {
  const attribute = {
    id: signedCredential.id,
    value: extractClaims(signedCredential.claim),
  }
  return attribute;
}

export const useSICActions = () => {
  const agent = useAgent();
  const did = useSelector(getDid)
  const dispatch = useDispatch();

  const constructCredentialAndStore = async (config: IAttributeConfig, claims: ClaimValues) => {
    const signedCredential = await agent.idw.create.signedCredential({
      metadata: config.metadata,
      claim: claims,
      subject: did
    }, await agent.passwordStore.getPassword());
    await agent.storage.store.verifiableCredential(signedCredential)
    return signedCredential;
  }

  const deleteSICredential = async (type: AttributeTypes, id: string) => {
    try {
      await agent.storage.delete.verifiableCredential(id);
      return id;
    } catch (err) {
      console.log({ err });
      throw new Error(`Error deleting a self issued credential with', ${id}`);
    }
  }

  const createSICredential = async (type: AttributeTypes, claims: ClaimValues) => {
    try {
      // assemble and store in the storage
      const signedCredential = await constructCredentialAndStore(attributeConfig[type], claims);

      // update redux store
      const attribute = formAttribute(signedCredential);
      dispatch(updateAttrs({ type, attribute }))
    } catch (err) {
      console.log({ err });
      throw new Error(`Error creating a self issued credential of type', ${type}`);
    }
  }

  const editSICredential = async (type: AttributeTypes, claims: ClaimValues, id: string) => {
    try {
      const signedCredential = await constructCredentialAndStore(attributeConfig[type], claims);
      const removedCredentialId = await deleteSICredential(type, id);

      const attribute = formAttribute(signedCredential);
      dispatch(editAttr({ type, attribute, id: removedCredentialId }))
    } catch (err) {
      console.log({ err });
      throw new Error(`Error editing a self issued credential of type', ${type}`);
    }
  }

  return { createSICredential, editSICredential }

}

// TODO: remove this one and use useSICActions instead
export const useCreateAttributes = () => {
  const agent = useAgent()
  const did = useSelector(getDid)
  const dispatch = useDispatch()

  const createSelfIssuedCredential = async (
    type: AttributeTypes,
    claims: ClaimValues,
  ) => {
    try {
      const credential = await agent.idw.create.signedCredential(
        {
          metadata: attributeConfig[type].metadata,
          claim: claims,
          subject: did,
        },
        await agent.passwordStore.getPassword(),
      )

      await agent.storage.store.verifiableCredential(credential)

      const attribute = {
        id: credential.id,
        value: extractClaims(credential.claim),
      }
      dispatch(updateAttrs({ type, attribute }))
    } catch (e) {
      throw new Error('Failed to create attribute!')
    }
  }

  return createSelfIssuedCredential
}
