import { useDispatch, useSelector } from 'react-redux'

import { deleteAttr, editAttr, updateAttrs } from '~/modules/attributes/actions'
import { AttributeTypes } from '~/types/credentials'
import { useAgent } from './sdk'
import { ClaimValues } from '~/modules/attributes/types'
import { extractClaims } from '~/utils/dataMapping'
import { getDid } from '~/modules/account/selectors'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { BaseMetadata } from '@jolocom/protocol-ts'

const formAttribute = (signedCredential: SignedCredential) => {
  const attribute = {
    id: signedCredential.id,
    value: extractClaims(signedCredential.claim),
  }
  return attribute
}

export const useSICActions = () => {
  const agent = useAgent()
  const did = useSelector(getDid)
  const dispatch = useDispatch()

  const constructCredentialAndStore = async (
    metadata: BaseMetadata,
    claims: ClaimValues,
  ) => {
    return agent.signedCredential({
      metadata,
      claim: claims,
      subject: did,
    })
  }

  const deleteStoredCredential = async (id: string) => {
    await agent.credentials.delete({ id })
    return id
  }

  // TODO: fix the structure of the store to remove the need to pass the type. We
  // can still search by id only, but it becomes messier
  const handleDeleteCredentialSI = async (id: string, type: AttributeTypes) => {
    try {
      await deleteStoredCredential(id)
      dispatch(deleteAttr({ type, id }))
    } catch (err) {
      console.log({ err })
      throw new Error(`Error deleting a self issued credential with', ${id}`)
    }
  }

  const handleCreateCredentialSI = async (
    type: AttributeTypes,
    claims: ClaimValues,
    metadata: BaseMetadata,
  ) => {
    try {
      // assemble and store in the storage
      const signedCredential = await constructCredentialAndStore(
        metadata,
        claims,
      )

      // update redux store
      const attribute = formAttribute(signedCredential)
      dispatch(updateAttrs({ type, attribute }))
    } catch (err) {
      console.warn(err)
      throw new Error(
        `Error creating a self issued credential of type', ${type}`,
      )
    }
  }

  const handleEditCredentialSI = async (
    type: AttributeTypes,
    claims: ClaimValues,
    metadata: BaseMetadata,
    id: string,
  ) => {
    try {
      const signedCredential = await constructCredentialAndStore(
        metadata,
        claims,
      )
      const removedCredentialId = await deleteStoredCredential(id)

      const attribute = formAttribute(signedCredential)
      dispatch(editAttr({ type, attribute, id: removedCredentialId }))
    } catch (err) {
      console.log({ err })
      throw new Error(
        `Error editing a self issued credential of type', ${type}`,
      )
    }
  }

  return {
    handleCreateCredentialSI,
    handleEditCredentialSI,
    handleDeleteCredentialSI,
  }
}
